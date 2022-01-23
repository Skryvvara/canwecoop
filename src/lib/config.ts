export abstract class Config {
  public static SteamApiKey = Config.getEnv<string>('STEAM_API_KEY');
  public static SessionSecret = Config.getEnv<string>('SESSION_SECRET');
  public static ApiSecret = Config.getEnv<string>('API_SECRET');
  public static Domain = Config.getEnv<string>('DOMAIN');

  private static getEnv<T>(key: string): T {
    try {
      return <T><unknown>process.env[key];
    } catch(error: any) {
      throw error;
    }
  }
}
