import { Game } from "@/types";
import { ApiClient } from "./apiClient";
import { sharedGetGame } from "@/shared";

export async function getGame(id: string) {
  return sharedGetGame(ApiClient!, "/games/", id);
}
