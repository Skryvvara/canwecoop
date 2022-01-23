import dotenv from 'dotenv';
dotenv.config({
  path: '../.env'
});
import { PrismaClient, Game, Category, Genre } from '../node_modules/@prisma/client';
import SteamAPI from 'steamapi';
const steam = new SteamAPI(process.env.STEAM_API_KEY!);
const db = new PrismaClient();

async function syncGames() {
  const start = performance.now();
  const badIDs = await db.badId.findMany();

  const allGames: number[] = [];
  const users = await db.user.findMany();
  await Promise.all(users.map(async(user) => {
    const games = await steam.getUserOwnedGames(user.id);
    await Promise.all(games.map((game) => {
      if (allGames.includes(game.appID)) return;
      allGames.push(game.appID);
    }));
  }));

  const chunked: number[][] = chunk(allGames, 175);

  let globalGame: any = null;

  for (const chunk of chunked) {
    await Promise.all(chunk.map(async(game) => {
      try {
        if (badIDs.findIndex((predicate) => predicate.id == String(game)) != -1) return;

        const detailsData: any = await steam.getGameDetails(String(game));
        globalGame = detailsData;

        let timeOptions: Intl.DateTimeFormatOptions = {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        };
        console.log(new Date(Date.now()).toLocaleString('de', timeOptions) + '|' + detailsData.name);

        const categories: Category[] = (detailsData.categories)
          ? detailsData.categories.map((category: any) => { return {id: String(category.id), description: String(category.description)}; })
          : [ {id: '1269', description: 'N/A' } ];

        const genres: Genre[] = (detailsData.genres)
          ? detailsData.genres.map((genre: any) => { return { id: String(genre.id), description: String(genre.description) }; })
          : [ {id: '1269', description: 'N/A' } ];

        // await Promise.all(categories.map((category) => category.id = String(category.id)));
        // await Promise.all(genres.map((genre) => genre.id = String(genre.id)));

        let metaScore: number = (detailsData.metacritic) ? detailsData.metacritic.score : -1;
        let metaUrl: string = (detailsData.metacritic) ? detailsData.metacritic.url : '';

        const dbGame: Game = {
          id: String(detailsData.steam_appid),
          name: String(detailsData.name).replace('\’', '\''),
          is_free: detailsData.is_free,
          short_description: detailsData.short_description,
          header_image: detailsData.header_image,
          website: detailsData.website || '',
          developers: detailsData.developers,
          publishers: detailsData.publishers,
          windows: detailsData.platforms.windows,
          mac: detailsData.platforms.mac,
          linux: detailsData.platforms.linux,
          metacriticScore: metaScore,
          metacriticUrl: metaUrl,
          background: detailsData.background,
        };
  
        await db.game.upsert({
          where: { id: dbGame.id },
          create: {
            ...dbGame,
            categories: {
              connectOrCreate: categories.map((cat) => ({
                where: {
                  id: cat.id
                },
                create: {
                  ...cat
                }
              }))
            },
            genres: {
              connectOrCreate: genres.map((genre) => ({
                where: {
                  id: genre.id
                },
                create: {
                  ...genre
                }
              }))
            }
          },
          update: {
            ...dbGame,
            categories: {
              connectOrCreate: categories.map((cat) => ({
                where: {
                  id: cat.id
                },
                create: {
                  ...cat
                }
              }))
            },
            genres: {
              connectOrCreate: genres.map((genre) => ({
                where: {
                  id: genre.id
                },
                create: {
                  ...genre
                }
              }))
            }
          },
          include: {
            categories: true,
            genres: true
          }
        });
      } catch(error: any) {
        console.error(error.message);
        if (!error.message.includes('No app found')) return;

        db.badId.upsert({
          where: { id: String(globalGame.steam_appid) },
          create: {
            id: String(globalGame.steam_appid)
          },
          update: {
            id: String(globalGame.steam_appid)
          }
        });
      }
    }));
    await new Promise((res) => setTimeout(res, 1000 * 60 * 7));
  }
  const end = performance.now();

  console.log('Service finished in '+Math.floor((end-start)/1000/60)+' minutes.');
}

function chunk(arr: any[], chunkSize: number) {
  if (chunkSize <= 0) throw 'Invalid chunk size';
  var R = [];
  for (var i=0, len=arr.length; i<len; i+=chunkSize)
    R.push(arr.slice(i, i+chunkSize));
  return R;
}

syncGames();
