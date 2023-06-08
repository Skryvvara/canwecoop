import { AuthContextProvider } from "@/context";
import "@/styles/_globals.scss";
import NextAdapterPages from "next-query-params/pages";
import { QueryParamProvider } from "use-query-params";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { Layout } from "@/components";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <QueryParamProvider adapter={NextAdapterPages}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </QueryParamProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
