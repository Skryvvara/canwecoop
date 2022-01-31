import { router } from '@trpc/server';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { userRouter } from 'routers/user';
import { gameRouter } from 'routers/game';

const appRouter = router()
.merge('game.', gameRouter)
.merge('user.', userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
