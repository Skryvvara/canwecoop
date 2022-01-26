import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { trpc } from 'lib/trpc';
import { useRouter } from 'next/router';
import { GameGrid } from 'components/gameGrid';

const Home: NextPage = () => {
  const router = useRouter();
  const { name } = router.query ?? undefined;
  const categories = router.query.categories != null ? router.query.categories.toString().split(',') : undefined;
  const games = trpc.useInfiniteQuery(
    ['allGames', { limit: 48, name: name?.toString(), categories: categories }], {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      keepPreviousData: true
    },
  );
  const gameCount = trpc.useQuery(['gameCount'], { refetchOnWindowFocus: false });

  return(
    <>
      <Head>
        <title>Home | CanWeCoop</title>
        <meta name="description" content="CanWeCoop WIP stay tuned for updates!" />
      </Head>

      <div className="container">
        <h1>We have a total of {gameCount.data} games!</h1>
        <input 
          type="text" 
          placeholder='search' 
          className='search' 
          defaultValue={name} 
          onChange={({ target }) => router.push({
            pathname: '/',
            query: {
              name: (target.value) ? target.value : undefined,
              categories: categories
            }
          })}
          />
          
          <label htmlFor="co-op">
            Co-op
            <input type="checkbox" name="co-op" id="co-op" onChange={({target}) => router.push({ pathname: '/', query: { name: name, categories: (target.checked) ? 'co-op' : undefined } }) } />
          </label>

        { 
          (games.data?.pages[0].games.length != 0)
          ? <GameGrid data={games.data} />
          : <div>
            <h2>Oh no! These aren&#39;t the games you&#39;re looking for.</h2>
            <p>If you think one of your games is missing, read <Link href='/about'><a className='appLink'>about how CanWeCoop works</a></Link>.</p>
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
