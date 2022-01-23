import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import prisma from 'lib/prisma';
import { steam } from 'lib/steam';
import { Game, Category, Genre } from '@prisma/client';
import { writeFileSync } from 'fs';
import { Cache, CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';
import { Config } from 'lib/config';

const gameCache = new CacheContainer(new MemoryStorage());

abstract class Fetcher {

  @Cache(gameCache, { ttl: 60 * 10, isLazy: false})
  public static async allGames() {
    const games = await prisma.game.findMany({
      include: {
        categories: true,
        genres: true
      }
    });
    return games;
  }
}

const appRouter = trpc.router()
.query('allGames', {
  async resolve() {
    const games = await Fetcher.allGames();

    return {
      games: games
    };
  }
})
.query('syncGames', {
  input: z.object({
    key: z.string()
  }),
  async resolve({ input }) {
    const { key } = input; 
    if (key != Config.ApiSecret) return;

    const badIDs = await prisma.badId.findMany();

    const allGames: number[] = [];
    const users = await prisma.user.findMany();
    await Promise.all(users.map(async(user) => {
      const games = await steam.getUserOwnedGames(users[0].id);
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
          if (badIDs.findIndex((predicate) => predicate.id == String(game)) == -1) return;

          const detailsData: any = await steam.getGameDetails(String(game));
          globalGame = detailsData;

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
            name: detailsData.name,
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
  
          await prisma.game.upsert({
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
          if (error.message != 'No app found') {
            writeFileSync(`./outerr/${globalGame.steam_appid}`, JSON.stringify(globalGame), {encoding: 'utf-8'} );
          } else {
            badIDs.push(globalGame.steam_appid);
          }
        }
      }));
      await new Promise((res) => setTimeout(res, 1000 * 60 * 7));
    }
    
    await Promise.all(badIDs.map((badID) => {
      prisma.badId.upsert({
        where: { id: badID.id },
        create: {
          ...badID
        },
        update: {
          ...badID
        }
      });
    }));
    return chunked.length;
  }
});

function chunk(arr: any[], chunkSize: number) {
  if (chunkSize <= 0) throw 'Invalid chunk size';
  var R = [];
  for (var i=0, len=arr.length; i<len; i+=chunkSize)
    R.push(arr.slice(i, i+chunkSize));
  return R;
}

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
