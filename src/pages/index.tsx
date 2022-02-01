import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { trpc } from 'lib/trpc';
import { useRouter } from 'next/router';
import { GameGrid } from 'components/gameGrid';
import { stringify } from 'query-string';
import { useContext } from 'react';
import { UserContext } from 'providers/userContextProvider';

interface ISearchProps {
  name?: string
  categories?: string[]
  genres?: string[]
  users?: string[]
  free?: boolean
}
 
const Home: NextPage = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const { name } = router.query ?? undefined;
  const categories = router.query.categories != null ? router.query.categories.toString().split(',') : [];
  const genres = router.query.genres != null ? router.query.genres.toString().split(',') : [];
  const users = router.query.users != null ? router.query.users.toString().split(',') : [];
  const free = (router.query.free === 'true') ? true : undefined;

  const gameCount = trpc.useQuery(['game.getGameCount'], { refetchOnWindowFocus: false });
  const games = trpc.useInfiniteQuery(
    ['game.getGames', { limit: 48, name: name?.toString(), categories: categories, genres: genres, users: users, free: free }], {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      keepPreviousData: true
    },
  );

  const setUrl = (key: keyof ISearchProps, value: any) => {
    let searchProps: ISearchProps = { name: name?.toString(), categories: categories, genres: genres, free: free, users: users};
    switch(key) {
      case 'name':
        searchProps[key] = (value) ? value : undefined;
        break;
      case 'categories':
        (searchProps.categories?.includes(value))
          ? searchProps.categories?.splice(searchProps.categories.indexOf(value), 1)
          : searchProps.categories?.push(value);
        break;
      case 'genres':
      (searchProps.genres?.includes(value))
        ? searchProps.genres?.splice(searchProps.genres.indexOf(value), 1)
        : searchProps.genres?.push(value);
        break;
      case 'users':
        (searchProps.users?.includes(value))
          ? searchProps.users?.splice(searchProps.users.indexOf(value), 1)
          : searchProps.users?.push(value);
        break;
      case 'free':
        searchProps.free = value;
        break;
    }
    let str = stringify(searchProps, { arrayFormat: 'comma', skipEmptyString: true });
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
          type="search" 
          placeholder='search' 
          className='search' 
          defaultValue={name} 
          onChange={({ target }) => setUrl('name', target.value)}
          />

        <label htmlFor="free">
          Free
          <input type="checkbox" checked={(free == true) ? true : false} name="free" id="free" onChange={({target}) => setUrl('free', target.checked ? true : undefined)} />
        </label>
          
        <label htmlFor="co-op">
          Co-op
          <input type="checkbox" checked={categories.includes('Co-op')} name="co-op" id="co-op" onChange={({target}) => setUrl('categories', 'Co-op')} />
        </label>

        <label htmlFor="controller-support">
          Controller Support
          <input type="checkbox" checked={categories.includes('controller support')} name="controller-support" id="controller-support" onChange={({target}) => setUrl('categories', 'controller support') } />
        </label>

        {
          (currentUser)
          ? <ul>
              <li>
                <label htmlFor={currentUser.displayName}>
                  {currentUser.displayName}
                  <input type="checkbox" checked={users.includes(currentUser.id)} name={currentUser.displayName} id={currentUser.displayName} onChange={({target}) => setUrl('users', currentUser.id) } />
                </label>
              </li>
              {
                currentUser.following.map((user) => (
                  <li key={user.id}>
                    <label htmlFor={user.displayName}>
                      {user.displayName}
                      <input type="checkbox" checked={users.includes(user.id)} name={user.displayName} id={user.displayName} onChange={({target}) => setUrl('users', user.id) } />
                    </label>
                  </li>
                ))
              }
          </ul>
          : <></>
        }

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
