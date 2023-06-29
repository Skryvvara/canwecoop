import { AxiosError } from "axios";
import { ApiClient } from "./apiClient";
import { IApiResponse } from "@/types";

export async function updateFriends(): Promise<IApiResponse> {
  const res = await ApiClient!
    .post<IApiResponse>("/friends", {}, { withCredentials: true })
    .then(() => {
      return {
        success: true,
        message: "Successfully updated friends list!",
      };
    })
    .catch((err: AxiosError) => {
      if (err.response?.status == 429) {
        return {
          success: false,
          message:
            "Too many requests, please wait before sending another request!",
        };
      } else {
        return {
          success: false,
          message: err.response?.statusText ?? "Unknown error.",
        };
      }
    });

  return res;
}
