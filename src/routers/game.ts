import { router } from '@trpc/server';
import { z } from 'zod';
import prisma from 'lib/prisma';

export const gameRouter = router()
.query('getGameCount', {
  async resolve() {
    const count = await prisma.game.count();
    return count;
  }
})
.query('getGames', {
  input: z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish(),
    name: z.string().nullish(),
    categories: z.string().array().nullish(),
    users: z.string().array().nullish(),
    free: z.boolean().nullish(),
  }),
  async resolve({ input }) {
    const limit = input.limit ?? 50;
    const { cursor } = input;
    let name = input.name ?? undefined;
    let categories = (input.categories?.filter((e) => e != '')) ?? [];
    let users = (input.users?.filter((e) => e != '')) ?? [];
    let free = input.free ?? undefined;

    const generateRelationFilter = (list: string[], relationName: string, column: string) => list.map((value) => ({ [relationName]: { some: { [column]: { in: [value], mode: 'insensitive' } } } }));

    const games = await prisma.game.findMany({
      where: {
        AND: [
          { name: { contains: name, mode: 'insensitive' } },
          { AND: generateRelationFilter(categories, 'categories', 'description') },
          { is_free: { equals: free } },
          { OR: generateRelationFilter(users, 'ownedBy', 'id') },
        ],
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        categories: true,
        genres: true,
        ownedBy: {
          select: {
            id: true,
            displayName: true,
            avatarfull: true
          }
        }
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
})
.query('getGame', {
  input: z.object({
    id: z.string()
  }),
  async resolve({ input }) {
    const { id } = input;
    const game = await prisma.game.findFirst({
      where: { id: id }
    });

    return {
      game
    };
  }
});
