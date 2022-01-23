import 'styles/globals.css';
import type { AppProps } from 'next/app';
import { UserContextProvider } from 'providers/userContextProvider';
import { ThemeProvider } from 'next-themes';
import MainLayout from 'components/layouts/mainLayout';
import { withTRPC } from '@trpc/next';
import { AppRouter } from './api/trpc/[trpc]';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { getBaseUrl } from 'lib/getBaseUrl';

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
