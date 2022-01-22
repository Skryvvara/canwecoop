import passport from '../../../lib/passport';
import router from '../../../lib/router';

interface IAuthReturnResponse extends Response {
	redirect: (path: string) => any;
}

const path = '/api/auth/return';

export default router
	.use(path, passport.authenticate('steam', { failureRedirect: '/' }))
	.get(path, (_, res: IAuthReturnResponse) => { res.redirect('/'); });
