import SteamAPI from 'steamapi';
import { Config } from './config';
export const steam = new SteamAPI(Config.SteamApiKey);
