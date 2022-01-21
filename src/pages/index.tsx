import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import router from '../lib/router';

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({user}) => {
  return(
    <>
      <Head>
        <title>Next Page</title>
        <meta name="description" content="Next Page" />
      </Head>

      {user 
			? <div>
				Welcome back!<br />
        <img src={user.photos[2].value} alt="pb" height="64" width={64} style={{borderRadius: 50+'%'}}/>
				From logging in, your SteamID is {user.displayName}.<br />
				You can call other APIs to get more information within `getServerSideProps` or within `lib/passport.ts`.<br />
				<Link href="/api/auth/logout">Logout</Link>
			</div>

			: <div>
				Welcome!<br />
				<Link href="/api/auth/login">Login</Link>
			</div>
		}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async({req, res}: any) => {
  await router.run(req, res);
  console.log(req.user);
  return { props: { user: req.user || null } };
};

export default Home;