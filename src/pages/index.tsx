import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { trpc } from 'lib/trpc';
import { useRouter } from 'next/router';
import { GameGrid } from 'components/gameGrid';
import { stringify } from 'query-string';

interface ISearchProps {
  name?: string,
  categories?: string[]
}
 
const Home: NextPage = () => {
  const router = useRouter();
  const { name } = router.query ?? undefined;
  const categories = router.query.categories != null ? router.query.categories.toString().split(',') : [];
  const free = router.query.free != 'true' ? false : true;
  const games = trpc.useInfiniteQuery(
    ['allGames', { limit: 48, name: name?.toString(), categories: categories, free: free }], {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      keepPreviousData: true
    },
  );
  const gameCount = trpc.useQuery(['gameCount'], { refetchOnWindowFocus: false });

  const setUrl = (key: keyof ISearchProps, value: any) => {
    let searchProps: ISearchProps = { name: name?.toString(), categories: categories};
    if (key == 'name') 
      searchProps[key] = (value) ? value : undefined;
    else if (key == 'categories')
      (searchProps.categories?.includes(value))
      ? searchProps.categories?.splice(searchProps.categories.indexOf(value), 1)
      : searchProps.categories?.push(value);
    let str = stringify(searchProps);

    if (str) str = '?'+str;

    router.push(str);
  };

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
          onChange={({ target }) => setUrl('name', target.value)}
          />
          
        <label htmlFor="co-op">
          Co-op
          <input type="checkbox" checked={categories.includes('Co-op')} name="co-op" id="co-op" onChange={({target}) => setUrl('categories', 'Co-op')} />
        </label>

        <label htmlFor="multi-player">
          Multi-player
          <input type="checkbox" checked={categories.includes('Multi-player')} name="Multi-player" id="Multi-player" onChange={({target}) => setUrl('categories', 'Multi-player') } />
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
