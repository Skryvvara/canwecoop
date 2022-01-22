import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { useContext } from 'react';
import { UserContext } from 'providers/userContextProvider';

const Home: NextPage = () => {
  const {user} = useContext(UserContext);

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
