import { Game } from "@/types";
import { ApiClient } from "./apiClient";

export async function getGames(query: any, searchString: string) {
  if (query.name === searchString) {
    const baseUrl = "/games";
    const queryString = new URLSearchParams(query as any).toString();
    try {
      const res = await ApiClient?.get(baseUrl + "?" + queryString);
      if (!res) throw "response object is null";

      if (!res.data.data || !res.data.meta) throw "result is invalid";

      return {
        games: res.data.data,
        meta: res.data.meta,
      };
    } catch (error: any) {
      console.warn(error);
      return {
        games: [],
        meta: {
          page: 0,
          lastPage: 0,
          total: 0,
        },
      };
    }
  }
}
