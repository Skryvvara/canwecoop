import { NextApiRequest, NextApiResponse } from 'next';
import router from '../../../lib/router';

const path = '/api/auth/user';

export default router.get(path, (req: any, res: any) => {
  res.json({ user: req.user });
});
