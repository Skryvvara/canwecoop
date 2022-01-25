import dotenv from 'dotenv';
dotenv.config({
  path: '../.env'
});
import { PrismaClient, Game, Category, Genre } from '../node_modules/@prisma/client';
import { Log, chunk, upsertGame }  from './lib';
import SteamAPI from 'steamapi';

const steam = new SteamAPI(process.env.STEAM_API_KEY!);
const db = new PrismaClient();

async function syncGames() {
  const start = performance.now();
  const badIds = await db.badId.findMany();

  const allGames: number[] = [];
  const users = await db.user.findMany();

  await Promise.all(users.map(async(user) => {
    const games = await steam.getUserOwnedGames(user.id);
    await Promise.all(games.map((game) => {
      allGames.push(game.appID);
    }));
  }));

  // filter duplicates
  allGames.filter((id, index) => allGames.indexOf(id) == index);

  const chunked: number[][] = chunk(allGames, 190);
  let globalGame: any = null;

  for (const chunk of chunked) {
    await Promise.all(chunk.map(async(game) => {
      try {
        if (badIds.findIndex((predicate) => predicate.id == String(game)) != -1) return;

        const detailsData: any = await steam.getGameDetails(String(game));

        if (detailsData.type != 'game') return;

        globalGame = detailsData;

        Log('info', `Processing game ${detailsData.name}`);

        if (detailsData.type != 'game') Log('info', `Found type: ${detailsData.type}`);

        const categories: Category[] = (detailsData.categories)
          ? detailsData.categories.map((category: any) => { return {id: String(category.id), description: String(category.description)}; })
          : [ {id: '1269', description: 'N/A' } ];

        const genres: Genre[] = (detailsData.genres)
          ? detailsData.genres.map((genre: any) => { return { id: String(genre.id), description: String(genre.description) }; })
          : [ {id: '1269', description: 'N/A' } ];

        let metaScore: number = (detailsData.metacritic) ? detailsData.metacritic.score : -1;
        let metaUrl: string = (detailsData.metacritic) ? detailsData.metacritic.url : '';

        const dbGame: Game = {
          id: String(detailsData.steam_appid),
          name: String(detailsData.name)
            .replace(/\’/g, '\'')
            .replace(/®/g, '')
            .replace(/™/g, ''),
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
          storeUrl: `https://store.steampowered.com/app/${detailsData.steam_appid}`
        };

        const result = await upsertGame(dbGame, categories, genres, db);

      } catch(error: any) {
        Log('error', error.message);
        if (!error.message.includes('No app found')) return;

        try {
          let rawId = globalGame.steam_appid;
          let id: string = (typeof rawId === 'string' || typeof rawId === 'number') ? String(rawId) : String(rawId.id);

          const badId = await db.badId.upsert({
            where: { id: id },
            create: {
              id: id
            },
            update: {}
          });
          badIds.push(badId);
        } catch(error: any) {
          Log('error', 'Could not create badID');
        }
      }
    }));
    console.log(badIds);
    await new Promise((res) => setTimeout(res, 1000 * 60 * 5.5));
  }
  const end = performance.now();

  Log('info', 'Service finished in '+Math.floor((end-start)/1000/60)+' minutes.');
}

syncGames();
