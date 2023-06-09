import axios from "axios";

export interface IClientConfig {
  apiBaseUrl: string;
  socials: {
    mail: string;
    linkedIn: string;
    twitter: string;
  };
}

export async function getClientConfig(): Promise<IClientConfig> {
  if (typeof window === "undefined")
    return {
      apiBaseUrl: "",
      socials: {
        mail: "",
        linkedIn: "",
        twitter: "",
      },
    };
  const res = await axios
    .get<IClientConfig>("/assets/config.json")
    .then((res) => res.data);
  return { ...res };
}

export const ClientConfig = await getClientConfig();
