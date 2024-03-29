import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import { useAuth, useDebounce } from "@/hooks";
import {
  BooleanParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";
import { CommaArrayParam, toggle } from "@/lib";
import { ApiError, GameGrid, SearchBar, SearchMenu } from "@/components";
import { UseQueryResult, useQuery } from "react-query";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Filter } from "react-feather";
import { getGames, IGames } from "@/api";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import { FilterMetaData, ApiGamesResponse } from "@/types";
import { serverGetGames } from "@/server/api/getGames";
import { serverGetGamesMetaData } from "@/server/api/getGamesMetaData";

interface IHomeProps {
  data: ApiGamesResponse;
  filterMetaData: FilterMetaData;
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const meta = await serverGetGamesMetaData();
  const games = await serverGetGames(ctx);

  return {
    props: {
      data: games,
      filterMetaData: meta,
    },
  };
}

export default function Home(props: IHomeProps) {
  const { user } = useAuth();
  const [showFilter, setShowFilter] = useState(false);
  const [query, setQuery] = useQueryParams(
    {
      name: withDefault(StringParam, ""),
      page: withDefault(NumberParam, 1),
      size: withDefault(NumberParam, 20),
      categories: CommaArrayParam,
      genres: CommaArrayParam,
      friends: CommaArrayParam,
      isFree: withDefault(BooleanParam, false),
      ignoreDefaultCategories: withDefault(BooleanParam, false),
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
    refetchOnMount: false,
    initialData: props.data,
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
        {!props.filterMetaData.error ? (
          <div className="container">
            <header className="main-header">
              <h1>Welcome to CanWeCoop!</h1>
              <p>
                If you need information on how CanWeCoop works, please read the{" "}
                <Link href={"/about"}>about page</Link>.
              </p>
              <p>Found a total of {gameData.data?.meta.total} games</p>
            </header>
            <SearchMenu>
              <SearchBar
                defaultValue={query.name}
                onChangeFn={(e) => setQuery({ name: e.target.value, page: 1 })}
              />
              <button
                className="icon-button"
                title="Show/hide filter menu"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter />
              </button>
            </SearchMenu>

            <section
              className={`${styles.searchFilterContainer} ${
                showFilter && styles.active
              }`}
            >
              <div>
                <section aria-labelledby="filter-categories">
                  <h2 id="filter-categories">Categories</h2>
                  <ul className={styles.gridBox}>
                    {props.filterMetaData.categories.map((category) => (
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
                    <li>
                      <label htmlFor="is-free">
                        <input
                          type="checkbox"
                          name="Is free"
                          id="is-free"
                          checked={query.isFree}
                          onChange={() =>
                            setQuery({ isFree: !query.isFree, page: 1 })
                          }
                        />
                        Free
                      </label>
                    </li>
                  </ul>
                </section>

                <section aria-labelledby="filter-genres">
                  <h2 id="filter-genres">Genres</h2>
                  <ul className={styles.gridBox}>
                    {props.filterMetaData.genres.map((genre) => (
                      <li key={genre.id}>
                        <label htmlFor={genre.description}>
                          <input
                            type="checkbox"
                            id={genre.description}
                            name={genre.description}
                            checked={query.genres.includes(genre.description)}
                            onChange={() =>
                              setQuery({
                                genres: toggle(query.genres, genre.description),
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
                                  friends: toggle(query.friends, friend.id),
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

                <section aria-labelledby="advanced-settings">
                  <details>
                    <summary>
                      <h2 id="advanced-settings">Advanced Settings</h2>
                    </summary>
                    <ul className={styles.gridBox}>
                      <label htmlFor="size" className={styles.pageSizeSlider}>
                        <input
                          type="range"
                          name="Page size"
                          id="size"
                          value={query.size}
                          min={12}
                          max={48}
                          step={4}
                          onChange={(e) =>
                            setQuery({
                              size: Number(e.target.value),
                              page: 1,
                            })
                          }
                        />
                        Page Size ({query.size})
                      </label>
                      <label htmlFor="ignore-default-categories">
                        <input
                          type="checkbox"
                          name="Ignore default categories"
                          id="ignore-default-categories"
                          checked={query.ignoreDefaultCategories}
                          onChange={(e) =>
                            setQuery({
                              ignoreDefaultCategories: e.target.checked,
                              page: 1,
                            })
                          }
                        />
                        Ignore default categories
                      </label>
                    </ul>
                  </details>
                </section>
              </div>
            </section>

            <GameGrid games={gameData.data?.games ?? []} />

            <nav className="paginationMenu">
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
        )}
      </>
    </>
  );
}
