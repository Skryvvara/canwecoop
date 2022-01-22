import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useContext } from 'react';
import { UserContext } from 'providers/userContextProvider';
import { useTheme } from 'next-themes';

const Home: NextPage = () => {
  const { user } = useContext(UserContext);
  const { theme, setTheme } = useTheme();

  if (!user) return (
    <div>
      <p>Welcome</p>
      <Link href="/api/auth/login">Login</Link>
    </div>
  );

  return(
    <>
      <Head>
        <title>Next Page</title>
        <meta name="description" content="Next Page" />
      </Head>

      <div>
        <input type="checkbox" name="toggle" id="toggle" onChange={(e) => setTheme((e.target.checked) ? 'dark' : 'light') } />
        <h1>Welcome back!</h1>
        <div>
          <Image src={user.avatarfull} alt='' height={48} width={48} className='profile' />
          <a target="_blank" rel="noreferrer" href={user.profileurl}>{user.displayName}</a>
        </div>
        <p>Welcome to CANWECOOP</p>
        <Link href="/api/auth/logout">Logout</Link>
      </div>
    </>
  );
};

export default Home;
