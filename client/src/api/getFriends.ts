import { User } from "@/types";
import { ApiClient } from "./apiClient";

export interface IFriends {
  friends: User[];
  meta: {
    page: number;
    size: number;
    lastPage: number;
    total: number;
  };
}

export async function getFriends(
  query: any,
  searchString: string,
  previousData?: IFriends
): Promise<IFriends> {
  const empty = {
    friends: [],
    meta: {
      page: 0,
      size: 0,
      lastPage: 0,
      total: 0,
    },
  };

  if (query.name !== searchString) {
    if (previousData) return previousData;
    return empty;
  }

  const baseUrl = "/friends";
  const queryString = new URLSearchParams(query as any).toString();
  try {
    const res = await ApiClient?.get<IFriends>(baseUrl + "?" + queryString, {
      withCredentials: true,
    });
    if (!res) throw "response object is null";

    if (!res.data) throw "result is invalid";

    return res.data;
  } catch (error: any) {
    console.warn(error);
    return empty;
  }
}
