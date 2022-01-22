import { User } from '@prisma/client';
import { NextApiResponse } from 'next';
import router from '../../../lib/router';

export interface IUserAuthRequest extends Request {
  user: User
}

const path = '/api/auth/user';

export default router.get(path, (req: IUserAuthRequest, res: NextApiResponse) => {
  res.json({ user: req.user });
});
