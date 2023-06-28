import styles from "@/styles/Friends.module.scss";
import {
  FriendGrid,
  LoadingSpinner,
  Protected,
  SearchBar,
  SearchMenu,
} from "@/components";
import { IFriends, getFriends, updateFriends } from "@/api";
import { useDebounce } from "@/hooks";
import Head from "next/head";
import { UseQueryResult, useQuery } from "react-query";
import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";
import { ArrowLeft, ArrowRight, RefreshCw, X } from "react-feather";
import { useState } from "react";

export async function getServerSideProps() {
  return { props: {} };
}

export default function Friends() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    success: boolean;
    message: string;
  }>({ success: false, message: "" });
  const [query, setQuery] = useQueryParams(
    {
      name: withDefault(StringParam, ""),
      page: withDefault(NumberParam, 1),
      size: withDefault(NumberParam, 20),
    },
    {
      removeDefaultsFromUrl: true,
    }
  );
  const debouncedNameQuery = useDebounce(query.name, 300);

  const friendsData: UseQueryResult<IFriends, unknown> = useQuery<IFriends>({
    queryKey: ["@friends", query, debouncedNameQuery],
    queryFn: async () =>
      getFriends(query, debouncedNameQuery, friendsData.data ?? undefined),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const onUpdateFriends = async () => {
    setIsLoading(true);
    const res = await updateFriends();
    setResponse(res);
    setIsLoading(false);
  };

  return (
    <Protected>
      <Head>
        <title>Friends | CanWeCoop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <header className="main-header">
          <h1>Friends</h1>
        </header>
        <SearchMenu>
          <SearchBar
            onChangeFn={(e) => {
              setQuery({
                name: e.target.value,
                page: 1,
              });
            }}
          />
          <button title="Update Friends" onClick={() => onUpdateFriends()}>
            {isLoading ? <LoadingSpinner /> : <RefreshCw />}
          </button>
        </SearchMenu>

        {!isLoading && response.message && (
          <span
            className={`${styles.banner} ${
              response.success ? styles.success : styles.failure
            }`}
          >
            {response.message}
            <button
              onClick={() => setResponse({ success: false, message: "" })}
            >
              <X />
            </button>
          </span>
        )}

        {friendsData.isLoading ? (
          <LoadingSpinner />
        ) : (
          friendsData.data && <FriendGrid friends={friendsData.data.friends} />
        )}

        <nav className={"paginationMenu"}>
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
              !friendsData.data || query.page >= friendsData.data.meta.lastPage
            }
          >
            <ArrowRight />
          </button>
        </nav>
      </div>
    </Protected>
  );
}
