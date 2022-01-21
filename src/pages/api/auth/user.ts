import { NextApiResponse } from 'next';
import { convertToUser, router } from '@/lib/.';
import { ExtendedNextApiRequest } from '@/types/.';

export default router.get((req: ExtendedNextApiRequest, res: NextApiResponse) => {
  try {
    const user = convertToUser(req.user);
    res.json({ user: req.user });
  } catch(error: any) {
    res.json({ user: undefined });
  }
});