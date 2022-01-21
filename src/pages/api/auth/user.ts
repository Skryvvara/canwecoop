import { NextApiRequest, NextApiResponse } from 'next';
import router from '../../../lib/router';

export default router.get((req: any, res: any) => {
  res.json({ user: req.user });
});