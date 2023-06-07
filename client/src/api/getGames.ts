import { Game } from "@/types";
import { ApiClient } from "./apiClient";

export interface IGames {
  games: Game[];
  meta: {
    page: number;
    size: number;
    lastPage: number;
    total: number;
  };
}

export async function getGames(
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

  const baseUrl = "/games";
  const queryString = new URLSearchParams(query as any).toString();
  try {
    const res = await ApiClient?.get<IGames>(baseUrl + "?" + queryString);
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
