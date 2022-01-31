import SteamAPI from 'steamapi';
import { Config } from './config';
export const steam = new SteamAPI(Config.SteamApiKey);

export async function getSteamFriends(id: string): Promise<string[]> {
  return (await steam.getUserFriends((id))).map((friend) => friend.steamID);
}
