import router from 'lib/router';

// Might be obsolte and will be removed in a future release
interface IAuthLogoutRequest extends Request {
    logout: () => any;
}

interface IAuthLogoutResponse extends Response {
    redirect: (path: string) => any;
}

const path = '/api/auth/logout';

export default router
    .get(path, (req: any, res: IAuthLogoutResponse) => { req.logout(); res.redirect(req.headers.referer ?? '/'); });
