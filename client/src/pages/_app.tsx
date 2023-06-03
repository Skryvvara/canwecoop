import { AuthContextProvider } from "@/context";
import "@/styles/globals.scss";
import NextAdapterPages from "next-query-params/pages";
import { QueryParamProvider } from "use-query-params";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <QueryParamProvider adapter={NextAdapterPages}>
        <Component {...pageProps} />
      </QueryParamProvider>
    </AuthContextProvider>
  );
}
