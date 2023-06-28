import { Tag } from "@/types";
import { ApiClient } from ".";

export interface IGamesMetaData {
  categories: Tag[];
  genres: Tag[];
  error: boolean;
}

export async function getGamesMetaData(): Promise<IGamesMetaData> {
  try {
    const res = await ApiClient?.get("/game-info");

    if (!res) throw "response object is null";

    if (!res.data.categories || !res.data.genres) throw "result is invalid";

    return {
      ...res.data,
      error: false,
    };
  } catch (error) {
    console.warn(error);
    return {
      categories: [],
      genres: [],
      error: true,
    };
  }
}
