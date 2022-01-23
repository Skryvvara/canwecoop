import 'styles/globals.css';
import type { AppProps } from 'next/app';
import { UserContextProvider } from 'providers/userContextProvider';
import { ThemeProvider } from 'next-themes';
import MainLayout from 'components/layouts/mainLayout';
import { withTRPC } from '@trpc/next';
import { AppRouter } from './api/trpc/[trpc]';
import { Config } from 'lib/config';

function App({ Component, pageProps}: AppProps) {
  return (
    <UserContextProvider>
      <ThemeProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
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
     const url = process.env.DOMAIN
     ? `${process.env.DOMAIN}/api/trpc`
     : 'http://localhost:3035/api/trpc';

    return {
      url: url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(App);
