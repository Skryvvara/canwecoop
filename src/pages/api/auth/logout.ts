import router from '../../../lib/router';

interface IAuthLogoutRequest extends Request {
    logout: () => any;
}

interface IAuthLogoutResponse extends Response {
    redirect: (path: string) => any;
}

const path = '/api/auth/logout';

export default router
    .get(path, (req: IAuthLogoutRequest, res: IAuthLogoutResponse) => { req.logout(); res.redirect('/'); });
