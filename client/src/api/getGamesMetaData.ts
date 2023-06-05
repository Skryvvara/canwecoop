import { Tag } from "@/types";
import { ApiClient } from ".";

export interface GamesMetaData {
  categories: Tag[];
  genres: Tag[];
  total: number;
  error: boolean;
}

export async function getGamesMetaData(): Promise<GamesMetaData> {
  try {
    const res = await ApiClient?.get("/game-info");

    if (!res) throw "response object is null";

    if (!res.data.categories || !res.data.genres || !res.data.total)
      throw "result is invalid";

    return {
      ...res.data,
      error: false,
    };
  } catch (error) {
    console.warn(error);
    return {
      categories: [],
      genres: [],
      total: 0,
      error: true,
    };
  }
}
