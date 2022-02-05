import { router } from '@trpc/server';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { userRouter } from 'routers/user';
import { gameRouter } from 'routers/game';
import { syncRouter } from 'routers/sync';

const appRouter = router()
.merge('game.', gameRouter)
.merge('user.', userRouter)
.merge('sync.', syncRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
