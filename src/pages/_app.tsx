import 'styles/globals.css';
import type { AppProps } from 'next/app';
import { UserContextProvider } from 'providers/userContextProvider';
import { ThemeProvider } from 'next-themes';
import MainLayout from 'components/layouts/mainLayout';

function MyApp({ Component, pageProps}: AppProps) {
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

export default MyApp;
