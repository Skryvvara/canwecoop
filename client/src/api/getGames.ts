import { Game } from "@/types";
import { ApiClient } from "./apiClient";
import { sharedGetGames } from "@/shared/getGames";

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
  return sharedGetGames(
    ApiClient!,
    "/games",
    query,
    searchString,
    previousData
  );
}
