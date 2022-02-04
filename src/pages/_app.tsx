import 'styles/globals.scss';
import type { AppProps } from 'next/app';
import { UserContextProvider } from 'providers/userContextProvider';
import { ThemeProvider } from 'next-themes';
import MainLayout from 'components/layouts/mainLayout';
import { withTRPC } from '@trpc/next';
import { AppRouter } from './api/trpc/[trpc]';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { getBaseUrl } from 'lib/getBaseUrl';
import { ExtendedStringifyOptions, NextQueryParamProvider } from 'next-query-params';

const stringifyOptions: ExtendedStringifyOptions = {
  transformSearchString: (searchString: string) => {
    const params = new URLSearchParams(searchString);
    params.forEach((value, key) => {
      if (value != '' && value != '0') return;
      params.delete(key);
    });
    return params.toString();
  }
};

function App({ Component, pageProps}: AppProps) {
  return (
    <UserContextProvider>
      <ThemeProvider>
        <NextQueryParamProvider stringifyOptions={stringifyOptions}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </NextQueryParamProvider>
      </ThemeProvider>
    </UserContextProvider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ]
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(App);
