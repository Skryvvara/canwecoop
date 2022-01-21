import { ExtendedNextApiRequest } from '@/types/.';
import { passport, router, convertToUser } from '@/lib/.';

interface AuthReturnResponse extends Response {
	redirect: (path: string) => any;
}

const path = '/api/auth/return';

export default router
	.use(path, passport.authenticate('steam', { failureRedirect: '/' }))
	.get(path, async(req: ExtendedNextApiRequest, res: AuthReturnResponse) => { 
		let reqUser = convertToUser(req.user);
		const user = await prisma.user.findFirst({
			where: { id: reqUser.id }
		});

		if (!user) {
			await prisma.user.create({
				data: { ...reqUser }
			});
		}

		res.redirect('/');
	});