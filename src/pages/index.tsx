import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GameGrid } from 'components/gameGrid';
import { useContext, useState } from 'react';
import { UserContext } from 'providers/userContextProvider';
import { StringParam, useQueryParams, withDefault } from 'next-query-params';

import { CustomArrayParam, CustomBooleanParam } from 'lib/queryParams';
import { toggle } from 'lib/arrayToogle';
import { trpc } from 'lib/trpc';

const Home: NextPage = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const [query, setQuery] = useQueryParams({
    name: withDefault(StringParam, undefined),
    categories: CustomArrayParam,
    genres: CustomArrayParam,
    users: CustomArrayParam,
    free: CustomBooleanParam,
  });
  const { name, categories, genres, users, free } = query;
  const [open, setOpen] = useState(false);

  const gameCount = trpc.useQuery(['game.getGameCount'], {
    refetchOnWindowFocus: false,
  });
  const games = trpc.useInfiniteQuery(
    [
      'game.getGames',
      {
        limit: 24,
        name: name?.toString(),
        categories: categories,
        genres: genres,
        users: users,
        free: free,
      },
    ],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  const gameCategories = trpc.useQuery(['game.getCategories'], {
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Head>
        <title>Home | CanWeCoop</title>
        <meta
          name="description"
          content="CanWeCoop WIP stay tuned for updates!"
        />
      </Head>

      <div className="container">
        <h1>We have a total of {gameCount.data} games!</h1>
        <input
          type="search"
          placeholder="search"
          className="search"
          defaultValue={name}
          onChange={({ target }) => setQuery({ name: target.value })}
        />

        <div className="selection-box">
          <button onClick={() => setOpen(!open)}>Filter categories</button>

          <div className={`category-grid ${open ? 'cg-open' : ''}`}>
            {gameCategories.data?.map((category) => (
              <label key={category.id} htmlFor={category.description}>
                <input
                  type="checkbox"
                  checked={categories.includes(category.description)}
                  name={category.description}
                  id={category.description}
                  onChange={({ target }) =>
                    setQuery({
                      categories: toggle(categories, category.description),
                    })
                  }
                />
                {category.description}
              </label>
            ))}
          </div>
        </div>

        {currentUser ? (
          <ul>
            <li>
              <label htmlFor={currentUser.displayName}>
                {currentUser.displayName}
                <input
                  type="checkbox"
                  checked={users.includes(currentUser.id)}
                  name={currentUser.displayName}
                  id={currentUser.displayName}
                  onChange={({ target }) =>
                    setQuery({ users: toggle(users, currentUser.id) })
                  }
                />
              </label>
            </li>
            {currentUser.following.map((user) => (
              <li key={user.id}>
                <label htmlFor={user.displayName}>
                  {user.displayName}
                  <input
                    type="checkbox"
                    checked={users.includes(user.id)}
                    name={user.displayName}
                    id={user.displayName}
                    onChange={({ target }) =>
                      setQuery({ users: toggle(users, user.id) })
                    }
                  />
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <></>
        )}

        {games.data?.pages[0].games.length != 0 ? (
          <GameGrid data={games.data} />
        ) : (
          <div>
            <h2>Oh no! These aren&#39;t the games you&#39;re looking for.</h2>
            <p>
              If you think one of your games is missing, read{' '}
              <Link href="/about">
                <a className="appLink">about how CanWeCoop works</a>
              </Link>
              .
            </p>
          </div>
        )}

        {games.hasNextPage ? (
          <button className="loadMore" onClick={() => games.fetchNextPage()}>
            Load more
          </button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Home;
