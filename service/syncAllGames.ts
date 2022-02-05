import dotenv from 'dotenv';
dotenv.config({
  path: '../.env'
});
import { PrismaClient } from '@prisma/client';
import { chunk, upsertAllGames } from './lib';
import SteamAPI from 'steamapi';

const steam = new SteamAPI(process.env.STEAM_API_KEY!);
const db = new PrismaClient();

async function syncGames() {
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
  await upsertAllGames(chunked);
}

syncGames();
