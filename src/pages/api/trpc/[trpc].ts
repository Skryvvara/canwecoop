import { router } from '@trpc/server';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { z } from 'zod';
import { Cache, CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';
import prisma from 'lib/prisma';

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

const appRouter = router()
.query('allGames', {
  async resolve() {
    const games = await Fetcher.allGames();

    return {
      games: games
    };
  }
});

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
