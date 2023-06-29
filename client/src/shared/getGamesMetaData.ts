import { Tag } from "@/types";
import { AxiosInstance } from "axios";

export interface IGamesMetaData {
  categories: Tag[];
  genres: Tag[];
  error: boolean;
}

export async function sharedGetGamesMetaData(
  client: AxiosInstance,
  url: string
): Promise<IGamesMetaData> {
  try {
    const res = await client.get(url);

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
