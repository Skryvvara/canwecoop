import dotenv from 'dotenv';
dotenv.config({
  path: '../.env'
});
import { PrismaClient, Category, Genre } from '@prisma/client';
import { logger, upsertGame, parseGameDetails } from '.';
import { syncUserGames } from './../syncUserGames';
import SteamAPI from 'steamapi';

const steam = new SteamAPI(process.env.STEAM_API_KEY!);
const db = new PrismaClient();

export async function upsertAllGames(chunked: number[][]) {
  const start = performance.now();
  const badIds = await db.badId.findMany();
  let globalGame: string = '';

  for (const chunk of chunked) {
    await Promise.all(chunk.map(async(game) => {
      try {
        if (badIds.findIndex((predicate) => predicate.id == String(game)) != -1) return;

        globalGame = String(game);
        const detailsData: any = await steam.getGameDetails(String(game));

        if (detailsData.type == 'video') return;

        logger.info(`Processing game ${detailsData.name}`);

        const categories: Category[] = (detailsData.categories)
          ? detailsData.categories.map((category: any) => { return {id: String(category.id), description: String(category.description)}; })
          : [ {id: '1269', description: 'N/A' } ];
    
        const genres: Genre[] = (detailsData.genres)
          ? detailsData.genres.map((genre: any) => { return { id: String(genre.id), description: String(genre.description) }; })
          : [ {id: '1269', description: 'N/A' } ];

        const dbGame = parseGameDetails(detailsData);

        await upsertGame(dbGame, categories, genres, db);
        logger.info('created entry for '+dbGame.name+' ('+dbGame.id+')');
      } catch(error: any) {
        logger.error(error.message);
        if (!error.message.includes('No app found')) return;

        try {
          let id = globalGame;

          const badId = await db.badId.upsert({
            where: { id: id },
            create: {
              id: id
            },
            update: {}
          });
          badIds.push(badId);
        } catch(error: any) {
          logger.error(`Could not create badID with id ${globalGame}`);
        }
      }
    }));
    if (chunk == chunked[chunked.length-1]) continue;
    await new Promise((res) => setTimeout(res, 1000 * 60 * 5.5));
  }
  const end = performance.now();

  logger.info('Service finished in '+Math.floor((end-start)/1000/60)+' minutes.');
  try {
    await syncUserGames();
  } catch(error: any) {
    logger.error(error.message);
  }
}
