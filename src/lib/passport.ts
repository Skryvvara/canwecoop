import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import { Config } from './config';
import { convertToUser } from './convertToUser';
import prisma from './prisma';

passport.serializeUser(function(user, done) {
	done(null, user);
});
  
passport.deserializeUser(function(obj: any, done) {
	done(null, obj);
});

passport.use(new SteamStrategy({
	returnURL: 'http://localhost:3000/api/auth/return',
	realm: 'http://localhost:3000',
	apiKey: Config.SteamApiKey
}, async(_: any, profile: any, done: any) => {
	let userData = convertToUser(profile);
	let user = await prisma.user.findFirst({
		where: {id: userData.id}
	});

	if (!user) {
		user = await prisma.user.create({ data: userData });
	}

	if (!user) throw 'No user found and was unable to create user record';

	if (user.displayName != userData.displayName) {
		user = await prisma.user.update({
			data: { displayName: userData.displayName },
			where: { id: user.id }
		});
	}

	// Fetch any more information to populate
	return done(null, user);
}));

export default passport;
