import axios from "axios";
import { IClientConfig } from "./getClientConfig";
import { GetServerSidePropsContext } from "next";

export async function getServerSideClientConfig(
  ctx: GetServerSidePropsContext
): Promise<IClientConfig> {
  const url = ctx.req.headers["host"];
  const proto = ctx.req.headers["x-forwarded-proto"];

  const res = await axios
    .get<IClientConfig>(proto + "://" + url + "/assets/config.json")
    .then((res) => res.data)
    .catch((err) => {
      console.error(err);
      return {
        apiBaseUrl: "",
        socials: {
          mail: "",
          linkedIn: "",
          twitter: "",
        },
      };
    });

  return res;
}
