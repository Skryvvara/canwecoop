import { NextApiRequest, NextApiResponse } from 'next';
import passport from 'lib/passport';
import router from 'lib/router';

const path = '/api/auth/return';

export default router
	.use(path, passport.authenticate('steam', { failureRedirect: '/' }))
	.get(path, (req: NextApiRequest, res: NextApiResponse) => {
		const route = req.cookies['origin'];
		res.setHeader('Set-Cookie', `origin=${req.headers.referer}; Max-Age=-1`);
		if (!route) {
			res.redirect('/');
			return;
		}
		res.redirect(route);
	});
