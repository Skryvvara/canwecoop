import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { UserContext } from 'providers/userContextProvider';
import { trpc } from 'lib/trpc';
import { GameCard } from 'components/gameCard';

const Home: NextPage = () => {
  const { user } = useContext(UserContext);
  const games = trpc.useQuery(['allGames'], {
    refetchOnWindowFocus: false
  }).data?.games;
  const [ filtered, setFiltered ] = useState(games);

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
        <h1>Welcome back!</h1>
        <div>
          <Image src={user.avatarfull} alt='' height={48} width={48} className='profile' />
          <a target="_blank" rel="noreferrer" href={user.profileurl}>{user.displayName}</a>
        </div>
        <p>Welcome to CANWECOOP</p>
        <Link href="/api/auth/logout">Logout</Link>

        <div className="games">
          <input placeholder='Search' className='search' type="text" onChange={(e) => setFiltered(games?.filter((g) => g.name.toLowerCase().includes(e.target.value.toLowerCase()))) } />
          <ul className='gameGrid'>
            { filtered?.map((game) => 
              <GameCard game={game} key={game.id} />
            ) }
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
