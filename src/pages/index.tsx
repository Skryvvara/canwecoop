import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from 'lib/trpc';
import { useRouter } from 'next/router';
import { GameGrid } from 'components/gameGrid';

const Home: NextPage = () => {
  const router = useRouter();
  const { name } = router.query ?? undefined;
  const games = trpc.useInfiniteQuery(
    ['allGames', { limit: 48, name: name?.toString() }], {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      keepPreviousData: true
    },
  );
  const old = games.data;

  return(
    <>
      <Head>
        <title>Home | CanWeCoop</title>
        <meta name="description" content="CanWeCoop WIP stay tuned for updates!" />
      </Head>

      <div className="container">
        <input type="text" placeholder='search' className='search' defaultValue={name} onChange={(e) => router.push('/?name='+e.target.value)}/>
        { 
          (games.data?.pages[0].games.length != 0)
          ? (games.isPreviousData)
            ? <GameGrid data={old} />
            : <GameGrid data={games.data} />
          : <div>
            <h2>Oh no! There are no games here :c</h2>
            <p>Due to the ratelimit on steams API we can only show your games about 24 hours after your first login.</p>
            <p>If a user that logged at least one day before you and has games in common you will see these games here already.</p>
          </div>
        }

        { games.hasNextPage 
          ? <button className='loadMore' onClick={() => games.fetchNextPage()}>Load more</button> 
          : <></> 
        }
      </div>
    </>
  );
};

export default Home;
