import axios from "axios";
import { sharedGetGamesMetaData } from "@/shared";
import { serverConfig } from "./getServerSideClientConfig";
import { Tag } from "@/types";

export interface IGamesMetaData {
  categories: Tag[];
  genres: Tag[];
  error: boolean;
}

export async function serverGetGamesMetaData(): Promise<IGamesMetaData> {
  return sharedGetGamesMetaData(axios, serverConfig.apiBaseUrl + "/game-info");
}
