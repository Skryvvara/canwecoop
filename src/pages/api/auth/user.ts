import { User } from '@prisma/client';
import { NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import router from 'lib/router';

export interface IUserAuthRequest extends Request {
  user: User
}

const path = '/api/auth/user';

export default router.get(path, async(req: IUserAuthRequest, res: NextApiResponse) => {
  try {
    if (!req.user) throw 'No user object on request';

    const userId = req.user.id;
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        followers: true,
        following: true
      }
    });

    res.json({ user: user });
  } catch(error: any) {
    res.json({ user: undefined });
  }
});
