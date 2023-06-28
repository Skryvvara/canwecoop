import { AxiosError } from "axios";
import { ApiClient } from "./apiClient";

export interface IUpdatedFriendsResponse {
  message: string;
  success: boolean;
}

export async function updateFriends(): Promise<IUpdatedFriendsResponse> {
  const res = await ApiClient!
    .post<IUpdatedFriendsResponse>("/friends", {}, { withCredentials: true })
    .then(() => {
      return {
        success: true,
        message: "successfully updated friends list",
      };
    })
    .catch((err: AxiosError) => {
      if (err.response?.status == 429) {
        return {
          success: false,
          message:
            "Too many requests, please wait before sending another request",
        };
      } else {
        return {
          success: false,
          message: err.response?.statusText ?? "Unknown error",
        };
      }
    });

  return res;
}
