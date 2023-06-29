import { Tag } from "@/types";
import { ApiClient } from ".";
import { sharedGetGamesMetaData } from "@/shared/getGamesMetaData";

export interface IGamesMetaData {
  categories: Tag[];
  genres: Tag[];
  error: boolean;
}

export async function getGamesMetaData(): Promise<IGamesMetaData> {
  return sharedGetGamesMetaData(ApiClient!, "/game-info");
}
