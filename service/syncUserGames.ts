import { PrismaClient } from '../node_modules/@prisma/client';
import SteamAPI from 'steamapi';

export async function syncUserGames() {
  const steam = new SteamAPI(process.env.STEAM_API_KEY!);
  const db = new PrismaClient();
  const allUserGames: {id: string, games: string[]}[] = [];

  const users = await db.user.findMany();
  await Promise.all(users.map(async(user) => {
    const games = await steam.getUserOwnedGames(user.id);
    allUserGames.push({ id: user.id, games: games.map((g) => String(g.appID)) });
  }));

  for (const user of allUserGames) {
    const dbGames = await db.game.findMany({
      select: {
        id: true
      }
    });
    let games = user.games.filter((game) => dbGames.findIndex((p) => p.id == game) != -1);

    try {
      await db.user.update({
        where: { id: user.id },
        data: {
          games: {
            connect: games.map((game) => ({
              id: game
            }))
          }
        }
      });
    } catch(error: any) {
      throw error;
    }
  }
}

syncUserGames();
