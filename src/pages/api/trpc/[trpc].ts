import { router } from '@trpc/server';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { z } from 'zod';
import prisma from 'lib/prisma';

const appRouter = router()
.query('gameCount', {
  async resolve() {
    const count = await prisma.game.count();
    return count;
  }
})
.query('userCount', {
  async resolve() {
    const count = await prisma.user.count();
    return count;
  }
})
.query('allGames', {
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
.query('game', {
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
})
.query('allUsers', {
  input: z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish(),
    name: z.string().nullish(),
    currentUserId: z.string().nullish()
  }),
  async resolve({ input }) {
    const limit = input.limit ?? 50;
    const { cursor } = input;
    const name = input.name ?? undefined;
    const currentUserId = input.currentUserId ?? undefined;

    const currentUser = await prisma.user.findFirst({
      where: {
        id: currentUserId
      }
    });
    if (!currentUser) throw 'Couldn\' fetch user';

    const users = await prisma.user.findMany({
      where: {
        displayName: { contains: name, mode: 'insensitive' },
        id: { in: currentUser.steamFriendIds }
      },
      include: { followers: true, following: true },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: 'asc' }
    });

    let nextCursor: typeof cursor | null = null;
    if  (users.length > limit) {
      const nextUser = users.pop();
      nextCursor = nextUser!.id;
    }

    return {
      users,
      nextCursor
    };
  }
})
.query('user', {
  input: z.object({
    id: z.string()
  }),
  async resolve({ input }) {
    const { id } = input;
    const user = await prisma.user.findFirst({
      where: { id: id }
    });

    return {
      user
    };
  }
})
.mutation('follow', {
  input:  z.object({
    currentId: z.string(),
    id: z.string()
  }),
  async resolve({ input }) {
    const { currentId, id } = input;
    if (!currentId || !id || currentId == id) throw 'Given ids were invalid';

    const current = await prisma.user.update({
      where: { id: id },
      data: {
        followers: {
          connect: {
            id: currentId
          }
        }
      },
      include: {
        followers: true,
        following: true
      }
    });

    return current;
  }
})
.mutation('unfollow', {
  input:  z.object({
    currentId: z.string(),
    id: z.string()
  }),
  async resolve({ input }) {
    const { currentId, id } = input;
    if (!currentId || !id || currentId == id) throw 'Given ids were invalid';

    const current = await prisma.user.update({
      where: { id: id },
      data: {
        followers: {
          disconnect: {
            id: currentId
          }
        }
      },
      include: {
        followers: true,
        following: true
      }
    });

    return current;
  }
});

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
