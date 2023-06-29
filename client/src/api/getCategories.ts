import { Tag } from "@/types";
import { ApiClient } from "./apiClient";

export async function getCategories(): Promise<Tag[]> {
  const baseUrl = "/categories";
  try {
    const res = await ApiClient?.get<Tag[]>(baseUrl);
    if (!res) throw "response object is null";

    if (!res.data) throw "result is invalid";

    return res.data;
  } catch (error: any) {
    console.warn(error);
    return [];
  }
}
