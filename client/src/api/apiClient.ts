import axios from "axios";
import { ClientConfig } from "./getClientConfig";

async function getAxiosClient() {
  if (typeof window === "undefined") return;
  const { apiBaseUrl } = ClientConfig;
  return axios.create({
    baseURL: apiBaseUrl,
  });
}

export const ApiClient = await getAxiosClient();
