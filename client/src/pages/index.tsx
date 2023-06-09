import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import { useAuth, useDebounce } from "@/hooks";
import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";
import { CommaArrayParam, toggle } from "@/lib";
import { ApiError, GameGrid } from "@/components";
import { UseQueryResult, useQuery } from "react-query";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Filter } from "react-feather";
import { getGames, getGamesMetaData, IGames, IGamesMetaData } from "@/api";

export async function getServerSideProps() {
  return { props: {} };
}

export default function Home() {
  const { user } = useAuth();
  const [showFilter, setShowFilter] = useState(false);
  const [query, setQuery] = useQueryParams(
    {
      name: withDefault(StringParam, ""),
      page: withDefault(NumberParam, 1),
      size: withDefault(NumberParam, 24),
      categories: CommaArrayParam,
      genres: CommaArrayParam,
      friends: CommaArrayParam,
    },
    {
      removeDefaultsFromUrl: true,
    }
  );
  const debouncedNameQuery = useDebounce(query.name, 300);

  const gameData: UseQueryResult<IGames, unknown> = useQuery<IGames>({
    queryKey: ["@games", query, debouncedNameQuery],
    queryFn: async () =>
      getGames(query, debouncedNameQuery, gameData.data ?? undefined),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const metaData = useQuery<IGamesMetaData>({
    queryKey: ["@meta"],
    queryFn: async () => getGamesMetaData(),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Head>
        <title>Home | CanWeCoop</title>
        <meta
          name="description"
          content="Find games to play with your friends!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        {!metaData.isLoading ? (
          !metaData.data?.error ? (
            <div className="container">
              <h1>We have a total of {metaData.data?.total} games!</h1>
              <section aria-label="search" className={styles.searchMenu}>
                <input
                  type="search"
                  defaultValue={query.name}
                  id="search"
                  name="search"
                  placeholder="Search"
                  className={styles.searchBar}
                  onChange={(e) => setQuery({ name: e.target.value, page: 1 })}
                />
                <button
                  className="icon-button"
                  title="Show/hide filter menu"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <Filter />
                </button>
              </section>

              <section
                className={`${styles.searchFilterContainer} ${
                  showFilter && styles.active
                }`}
              >
                <div>
                  <section aria-label="filter-pagesize">
                    <h2 id="filter-pagesize">Page size</h2>
                    <input
                      type="range"
                      name="size"
                      id="size"
                      value={query.size}
                      min={12}
                      max={48}
                      step={4}
                      onChange={(e) =>
                        setQuery({ size: Number(e.target.value), page: 1 })
                      }
                    />
                  </section>
                  <section aria-labelledby="filter-categories">
                    <h2 id="filter-categories">Categories</h2>
                    <ul className={styles.gridBox}>
                      {metaData.data?.categories.map((category) => (
                        <li key={category.id}>
                          <label htmlFor={category.description}>
                            <input
                              type="checkbox"
                              id={category.description}
                              name={category.description}
                              checked={query.categories.includes(
                                category.description
                              )}
                              onChange={() =>
                                setQuery({
                                  categories: toggle(
                                    query.categories,
                                    category.description
                                  ),
                                  page: 1,
                                })
                              }
                            />
                            {category.description}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section aria-labelledby="filter-genres">
                    <h2 id="filter-genres">Genres</h2>
                    <ul className={styles.gridBox}>
                      {metaData.data?.genres.map((genre) => (
                        <li key={genre.id}>
                          <label htmlFor={genre.description}>
                            <input
                              type="checkbox"
                              id={genre.description}
                              name={genre.description}
                              checked={query.genres.includes(genre.description)}
                              onChange={() =>
                                setQuery({
                                  genres: toggle(
                                    query.genres,
                                    genre.description
                                  ),
                                  page: 1,
                                })
                              }
                            />
                            {genre.description}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {user && user.friends?.length > 0 && (
                    <section aria-labelledby="filter-friends">
                      <h2 id="filter-friends">Friends</h2>
                      <ul className={styles.gridBox}>
                        {user.friends.map((friend) => (
                          <li key={friend.id}>
                            <label htmlFor={friend.id}>
                              <input
                                type="checkbox"
                                id={friend.id}
                                name={friend.displayName}
                                checked={query.friends.includes(friend.id)}
                                onChange={() =>
                                  setQuery({
                                    friends: toggle(
                                      query.categories,
                                      friend.id
                                    ),
                                    page: 1,
                                  })
                                }
                              />
                              {friend.displayName}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </section>

              <GameGrid games={gameData.data?.games ?? []} />

              <nav className={styles.paginationMenu}>
                <button
                  className="iconButton"
                  title="Previous page"
                  onClick={() => setQuery({ page: query.page - 1 })}
                  disabled={query.page <= 1}
                >
                  <ArrowLeft />
                </button>

                <button
                  className="iconButton"
                  title="Next page"
                  onClick={() => setQuery({ page: query.page + 1 })}
                  disabled={
                    !gameData.data || query.page >= gameData.data.meta.lastPage
                  }
                >
                  <ArrowRight />
                </button>
              </nav>
            </div>
          ) : (
            <ApiError />
          )
        ) : (
          <></>
        )}
      </>
    </>
  );
}
