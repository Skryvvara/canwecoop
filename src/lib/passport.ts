import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import { Config } from '.';

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
}, (_: any, profile: any, done: any) => {
	// Fetch any more information to populate
	return done(null, profile);
}));

export default passport;