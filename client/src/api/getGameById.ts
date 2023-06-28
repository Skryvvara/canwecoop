import { Game } from "@/types";
import { ApiClient } from "./apiClient";
import { AxiosError } from "axios";

export async function getGameById(id: string): Promise<Game> {
  const res = await ApiClient!
    .get("/games/" + id)
    .then((res) => {
      if (res.data && res.status == 200) {
        return res.data;
      }
    })
    .catch((err: AxiosError) => {
      console.error(err);
      return {};
    });

  return res;
}
