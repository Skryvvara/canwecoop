import axios from "axios";
import { IGames } from "@/api";
import { sharedGetGames } from "@/shared";
import { GetServerSidePropsContext } from "next";
import { serverConfig } from "./getServerSideClientConfig";

export async function serverGetGames(
  ctx: GetServerSidePropsContext
): Promise<IGames> {
  const query = {
    name: (ctx.query["name"] as string) ?? "",
    page: ctx.query["page"] ?? 1,
    size: ctx.query["size"] ?? 20,
    categories: ctx.query["categories"] ?? [],
    genres: ctx.query["genres"] ?? [],
    friends: ctx.query["friends"] ?? [],
    isFree: ctx.query["isFree"] ?? false,
    ignoreDefaultCategories: ctx.query["ignoreDefaultCategories"] ?? false,
  };

  return sharedGetGames(
    axios,
    serverConfig.apiBaseUrl + "/games",
    query,
    query.name
  );
}
