import { IGames } from "@/api";
import { AxiosInstance } from "axios";

export async function sharedGetGames(
  client: AxiosInstance,
  url: string,
  query: any,
  searchString: string,
  previousData?: IGames
): Promise<IGames> {
  const empty = {
    games: [],
    meta: {
      page: 0,
      size: 0,
      lastPage: 0,
      total: 0,
    },
  };
  if (query.name !== searchString) {
    if (previousData) return previousData;
    return empty;
  }
  const queryString = new URLSearchParams(query as any).toString();
  try {
    const res = await client.get<IGames>(url + "?" + queryString);
    if (!res) throw "response object is null";

    if (!res.data.games || !res.data.meta) throw "result is invalid";

    return {
      games: res.data.games,
      meta: res.data.meta,
    };
  } catch (error: any) {
    console.warn(error);
    return empty;
  }
}
