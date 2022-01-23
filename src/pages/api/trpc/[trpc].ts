import { router } from '@trpc/server';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { z } from 'zod';
import { Cache, CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';
import prisma from 'lib/prisma';

const gameCache = new CacheContainer(new MemoryStorage());

const appRouter = router()
.query('allGames', {
  input: z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish(),
    name: z.string().nullish()
  }),
  async resolve({ input }) {
    const limit = input.limit ?? 50;
    const { cursor } = input;
    const name = input.name != null ? input.name : undefined;
    const games = await prisma.game.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' }
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        categories: true,
        genres: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    let nextCursor: typeof cursor | null = null;
    if (games.length > limit) {
      const nextGame = games.pop();
      nextCursor = nextGame!.id;
    }

    return {
      games,
      nextCursor
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
