import { Game } from "@/types";
import { AxiosError, AxiosInstance } from "axios";

export async function sharedGetGame(
  client: AxiosInstance,
  url: string,
  id: string
): Promise<{
  data?: Game;
  success: boolean;
}> {
  const res = await client
    .get(url + id)
    .then((res) => {
      if (res.data && res.status == 200) {
        return {
          data: res.data,
          success: true,
        };
      } else {
        return {
          data: undefined,
          success: false,
        };
      }
    })
    .catch((err: AxiosError) => {
      console.error(err);
      return {
        data: undefined,
        success: false,
      };
    });

  return res;
}
