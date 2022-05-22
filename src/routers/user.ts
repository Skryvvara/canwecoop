import { router } from '@trpc/server';
import { z } from 'zod';
import prisma from 'lib/prisma';

export const userRouter = router()
.query('getUserCount', {
  async resolve() {
    const count = await prisma.user.count();
    return count;
  }
})
.query('getUsers', {
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

    let friends: string[] = [];
    if (currentUserId) {
      const currentUser = await prisma.user.findFirst({
        where: { id: currentUserId },
      });
      if (!currentUser) throw `Couldn't fetch user with id ${currentUserId}`;
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { displayName: { contains: name, mode: 'insensitive' } },
          { id: { in: friends } }
        ]
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
.query('getUser', {
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
.query('getFollowing', {
  input: z.object({
    id: z.string().nullish()
  }),
  async resolve({ input }) {
    const { id } = input;
    if (!id) return;

    const user = await prisma.user.findFirst({
      where: { id: id },
      select: {
        following: true
      }
    });

    return user;
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
