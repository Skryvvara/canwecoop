import { readFileSync } from "fs";

interface IServerConfig {
  apiBaseUrl: string;
}

export async function getServerSideClientConfig(): Promise<IServerConfig> {
  const serverConfig: IServerConfig = JSON.parse(
    readFileSync("./config/server-config.json", "utf-8")
  );

  return serverConfig;
}

export const serverConfig: IServerConfig = await getServerSideClientConfig();
