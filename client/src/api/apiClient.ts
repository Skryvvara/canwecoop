import axios from "axios";
import { getClientConfig } from "./getClientConfig";

async function getAxiosClient() {
  if (typeof window === "undefined") return;
  const { apiBaseUrl } = await getClientConfig();
  return axios.create({
    baseURL: apiBaseUrl,
  });
}

export const ApiClient = await getAxiosClient();
