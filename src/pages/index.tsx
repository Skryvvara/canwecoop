import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { UserContext } from 'providers/userContextProvider';
import { trpc } from 'lib/trpc';
import { GameCard } from 'components/gameCard';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();
  const { name } = router.query ?? undefined;
  const games = trpc.useInfiniteQuery(
    ['allGames', { limit: 48, name: name?.toString() }], {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false
    },
  );

  return(
    <>
      <Head>
        <title>Home | CanWeCoop</title>
        <meta name="description" content="CanWeCoop WIP stay tuned for updates!" />
      </Head>

      <div className="container">
        <input type="text" placeholder='search' className='search' value={name} onChange={(e) => router.push('/?name='+e.target.value)}/>
        <ul className='gameGrid'>
          { 
            games.data?.pages.map((page) => (
              page.games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))
            ))
          }
        </ul>
        { games.hasNextPage ? <button className='loadMore' onClick={() => games.fetchNextPage()}>Load more</button> : <></> }
      </div>
    </>
  );
};

export default Home;
