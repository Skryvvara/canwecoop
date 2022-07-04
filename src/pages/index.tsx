import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { GameGrid } from 'components/gameGrid';
import { useContext, useMemo, useState } from 'react';
import { UserContext } from 'context';
import { StringParam, useQueryParams, withDefault } from 'next-query-params';
import { FaFilter } from 'react-icons/fa';

import { CustomArrayParam, CustomBooleanParam } from 'lib/queryParams';
import { toggle } from 'lib/arrayToggle';
import { trpc } from 'lib/trpc';
import { Checkbox } from 'components/checkbox';

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

  const allUsers: any[] = useMemo(() => {
    let users: any[] = [];
    if (currentUser) users = users.concat([currentUser]);
    if (following.data?.following)
      users = users.concat(following.data.following);
    return users;
  }, [following, currentUser]);

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
          <button
            className="appBtn"
            aria-label="Filter"
            name="Filter"
            title="Apply filters"
            onClick={() => setOpen(!open)}
          >
            <FaFilter className="icon" />
          </button>
        </section>

        <div className="selection-box">
          <div className={`selection-grid ${open ? 'cg-open' : ''}`}>
            <h3>Categories</h3>
            <ul>
              {gameCategories.data?.map((category) => (
                <li key={category.id}>
                  <Checkbox
                    name={category.description}
                    checked={categories.includes(category.description)}
                    fn={() => {
                      setQuery({
                        categories: toggle(categories, category.description),
                      });
                    }}
                  />
                </li>
              ))}
              <li>
                <Checkbox
                  name="free"
                  checked={free ?? false}
                  label="Free"
                  fn={({ target }) => {
                    setQuery({ free: target.checked });
                  }}
                />
              </li>
            </ul>
            <h3>Genres</h3>
            <ul>
              {gameGenres.data?.map((genre) => (
                <li key={genre.id}>
                  <Checkbox
                    name={genre.description}
                    checked={genres.includes(genre.description)}
                    fn={() => {
                      setQuery({ genres: toggle(genres, genre.description) });
                    }}
                  />
                </li>
              ))}
            </ul>
            {currentUser && (
              <>
                <h3>Users</h3>
                <ul>
                  {allUsers.map((user) => {
                    return (
                      <li key={user.id}>
                        <Checkbox
                          name={user.displayName}
                          checked={users.includes(user.id)}
                          fn={() => {
                            setQuery({ users: toggle(users, user.id) });
                          }}
                        />
                      </li>
                    );
                  })}
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
