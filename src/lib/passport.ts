import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import { Config } from './config';
import prisma from './prisma';
import { getBaseUrl } from './getBaseUrl';
import { User } from '@prisma/client';

passport.serializeUser(function(user, done) {
	done(null, user);
});
  
passport.deserializeUser(function(obj: any, done) {
	done(null, obj);
});

const url = getBaseUrl();

passport.use(new SteamStrategy({
	returnURL: `${url}/api/auth/return`,
	realm: url,
	apiKey: Config.SteamApiKey
}, async(_: any, profile: any, done: any) => {
	let userData = {
		id: profile.id,
		displayName: profile.displayName,
		avatar: profile._json.avatar,
		avatarmedium: profile._json.avatarmedium,
		avatarfull: profile._json.avatarfull,
		profileurl: profile._json.profileurl,
	};

	let user = await prisma.user.findFirst({
		where: { id: userData.id }
	});

	if (!user) user = await prisma.user.create({ 
		data: userData, 
		include: {
			followers: true,
			following: true
		} 
	});

	if (!user) throw 'No user found and was unable to create user record';

	user = await prisma.user.update({
		data: { 
			displayName: userData.displayName,
			avatar: userData.avatar,
			avatarmedium: userData.avatarmedium,
			avatarfull: userData.avatarfull,
			profileurl: userData.profileurl
		},
		where: { id: user.id },
		include: {
			followers: true,
			following: true
		}
	});

	return done(null, user);
}));

export default passport;
