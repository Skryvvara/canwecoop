import axios from "axios";

export interface IClientConfig {
  apiBaseUrl: string;
}

export async function getClientConfig(): Promise<IClientConfig> {
  if (typeof window === "undefined") return { apiBaseUrl: "" };
  const res = await axios
    .get<IClientConfig>("/assets/config.json")
    .then((res) => res.data);
  return { ...res };
}
