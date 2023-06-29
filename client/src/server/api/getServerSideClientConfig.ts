import { readFileSync } from "fs";

interface IServerConfig {
  apiBaseUrl: string;
}

export async function getServerSideClientConfig(): Promise<IServerConfig> {
  try {
    const serverConfig: IServerConfig = JSON.parse(
      readFileSync("./config/server-config.json", "utf-8")
    );
    return serverConfig;
  } catch (error) {
    console.error(error);
    return {
      apiBaseUrl: "",
    };
  }
}

export const serverConfig: IServerConfig = await getServerSideClientConfig();
