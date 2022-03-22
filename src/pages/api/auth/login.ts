import { NextApiRequest, NextApiResponse } from 'next';
import passport from 'lib/passport';
import router from 'lib/router';

interface IAuthLoginResponse extends Response {
	redirect: (path: string) => any;
}

const path = '/api/auth/login';

export default router
	.use(path, (req: NextApiRequest, res: NextApiResponse, next: any) => {
		res.setHeader('Set-Cookie', `origin=${req.headers.referer}`);
		next();
	})
	.use(path, passport.authenticate('steam', { failureRedirect: '/'}))
	.get(path, (_, res: IAuthLoginResponse) => res.redirect('/'));
