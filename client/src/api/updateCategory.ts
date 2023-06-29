import { IApiResponse, Tag } from "@/types";
import { ApiClient } from "./apiClient";
import { AxiosError } from "axios";

export async function updateCategory(category: Tag): Promise<IApiResponse> {
  const baseUrl = "/categories";
  const res = await ApiClient!
    .put(baseUrl, category, {
      withCredentials: true,
    })
    .then((res) => {
      if (res.data && res.status == 200) {
        return {
          success: true,
          message: res.data,
        };
      } else {
        return {
          success: false,
          message: "Unknown error.",
        };
      }
    })
    .catch((err: AxiosError) => {
      console.warn(err);
      return {
        success: false,
        message: err.message ?? "Unknown error.",
      };
    });

  return res;
}
