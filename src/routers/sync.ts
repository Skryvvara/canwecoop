import { router } from '@trpc/server';
import { z } from 'zod';
import { exec } from 'child_process';
import logger from 'lib/logger';

export const syncRouter = router()
.query('allGames', {
  input: z.object({
    key: z.string()
  }),
  async resolve({ input }) {
    const { key } = input;

    if (key != process.env.API_SECRET) return { msg: 'INVALID REQUEST' };

    exec('cd service && yarn sync:allGames');
    logger.info('Started task "Sync All Games"');
  }
})
.query('missingGames', {
  input: z.object({
    key: z.string()
  }),
  async resolve({ input }) {
    const { key } = input;

    if (key != process.env.API_SECRET) return { msg: 'INVALID REQUEST' };

    exec('cd service && yarn sync:missingGames');
    logger.info('Started task "Sync Missing Games"');
  }
})
.query('userGames', {
  input: z.object({
    key: z.string()
  }),
  async resolve({ input }) {
    const { key } = input;

    if (key != process.env.API_SECRET) return { msg: 'INVALID REQUEST' };

    exec('cd service && yarn sync:userGames');
    logger.info('Started task "Sync User Games"');
  }
});
