import dotenv from 'dotenv';
dotenv.config({
  path: '../.env'
});
import { PrismaClient } from '@prisma/client';
import { chunk, logger, upsertAllGames } from './lib';
import SteamAPI from 'steamapi';

const steam = new SteamAPI(process.env.STEAM_API_KEY!);
const db = new PrismaClient();

async function syncGames() {
  try {
    let allGames: number[] = [];
    const users = await db.user.findMany();
  
    await Promise.all(users.map(async(user) => {
      const games = await steam.getUserOwnedGames(user.id);
      await Promise.all(games.map((game) => {
        allGames.push(game.appID);
      }));
    }));
  
    const allGameIds = await db.game.findMany({ select: { id: true } });
    
    // filter duplicates and only select games missing from DB
    allGames = allGames.filter((id, index) => allGames.indexOf(id) == index);
    allGames = allGames.filter((id) => allGameIds.findIndex((game) => game.id == String(id)) == -1);
    
    const chunked: number[][] = chunk(allGames, 190);
    await upsertAllGames(chunked);
  } catch(error: any) {
    logger.error(error.message);
  }
}

syncGames();
