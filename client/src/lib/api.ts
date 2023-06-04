import axios from "axios";

async function getAxiosClient() {
  if (typeof window === "undefined") return;
  const { apiBaseUrl } = await getClientConfig();
  return axios.create({
    baseURL: apiBaseUrl,
  });
}

interface IClientConfig {
  apiBaseUrl: string;
}

export async function getClientConfig(): Promise<IClientConfig> {
  if (typeof window === "undefined") return { apiBaseUrl: "" };
  const res = await axios
    .get<IClientConfig>("/assets/config.json")
    .then((res) => res.data);
  return { ...res };
}

export const ApiClient = await getAxiosClient();
