import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { GameGrid } from 'components/gameGrid';
import { useContext, useState } from 'react';
import { UserContext } from 'context';
import { StringParam, useQueryParams, withDefault } from 'next-query-params';

import { CustomArrayParam, CustomBooleanParam } from 'lib/queryParams';
import { toggle } from 'lib/arrayToggle';
import { trpc } from 'lib/trpc';

const Home: NextPage = () => {
  const { currentUser } = useContext(UserContext);
  const [query, setQuery] = useQueryParams({
    name: withDefault(StringParam, undefined),
    categories: CustomArrayParam,
    genres: CustomArrayParam,
    users: CustomArrayParam,
    free: CustomBooleanParam,
  });
  const following = trpc.useQuery(
    ['user.getFollowing', { id: currentUser?.id }],
    { refetchOnWindowFocus: false }
  );
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
  const gameGenres = trpc.useQuery(['game.getGenres'], {
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
        <section aria-label="search" className="input-row">
          <input
            type="search"
            placeholder="search"
            className="search"
            defaultValue={name}
            onChange={({ target }) => setQuery({ name: target.value })}
          />
          <button className="appBtn" onClick={() => setOpen(!open)}>
            Filter
          </button>
        </section>

        <div className="selection-box">
          <div className={`selection-grid ${open ? 'cg-open' : ''}`}>
            <h3>Categories</h3>
            <ul>
              {gameCategories.data?.map((category) => (
                <li key={category.id}>
                  <label htmlFor={category.description}>
                    <input
                      type="checkbox"
                      checked={categories.includes(category.description)}
                      name={category.description}
                      id={category.description}
                      onChange={() =>
                        setQuery({
                          categories: toggle(categories, category.description),
                        })
                      }
                    />
                    {category.description}
                  </label>
                </li>
              ))}
              <li>
                <label htmlFor="free">
                  <input
                    type="checkbox"
                    checked={free}
                    name="free"
                    id="free"
                    onChange={({ target }) =>
                      setQuery({ free: target.checked })
                    }
                  />
                  Free
                </label>
              </li>
            </ul>
            <h3>Genres</h3>
            <ul>
              {gameGenres.data?.map((genre) => (
                <li key={genre.id}>
                  <label htmlFor={genre.description}>
                    <input
                      type="checkbox"
                      checked={genres.includes(genre.description)}
                      name={genre.description}
                      id={genre.description}
                      onChange={() =>
                        setQuery({ genres: toggle(genres, genre.description) })
                      }
                    />
                    {genre.description}
                  </label>
                </li>
              ))}
            </ul>
            {currentUser && (
              <>
                <h3>Users</h3>
                <ul>
                  <li>
                    <label htmlFor={currentUser.displayName}>
                      <input
                        type="checkbox"
                        checked={users.includes(currentUser.id)}
                        name={currentUser.displayName}
                        id={currentUser.displayName}
                        onChange={() =>
                          setQuery({ users: toggle(users, currentUser.id) })
                        }
                      />
                      {currentUser.displayName}
                    </label>
                  </li>
                  {following.data?.following.map((user) => (
                    <li key={user.id}>
                      <label htmlFor={user.displayName}>
                        <input
                          type="checkbox"
                          checked={users.includes(user.id)}
                          name={user.displayName}
                          id={user.displayName}
                          onChange={() =>
                            setQuery({ users: toggle(users, user.id) })
                          }
                        />
                        {user.displayName}
                      </label>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

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
