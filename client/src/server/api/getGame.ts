import axios from "axios";
import { sharedGetGame } from "@/shared";
import { serverConfig } from "./getServerSideClientConfig";

export async function serverGetGame(id: string) {
  return sharedGetGame(axios, serverConfig.apiBaseUrl + "/games/", id);
}
