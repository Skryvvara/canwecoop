import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import router from '../lib/router';
import { useContext } from 'react';
import { fetcher, useUser } from '../lib/hook';
import useSWR from 'swr';

const Home: NextPage = () => {
  const [user] = useUser();

  if (!user) return <div>
				Welcome!<br />
				<Link href="/api/auth/login">Login</Link>
			</div>;

  return(
    <>
      <Head>
        <title>Next Page</title>
        <meta name="description" content="Next Page" />
      </Head>

      <div>
        Welcome back!<br />
        <img src={user.photos[2].value} alt="pb" height="64" width={64} style={{borderRadius: 50+'%'}}/>
        From logging in, your SteamID is {user.displayName}.<br />
        You can call other APIs to get more information within `getServerSideProps` or within `lib/passport.ts`.<br />
        <Link href="/api/auth/logout">Logout</Link>
      </div>
    </>
  );
};

export default Home;