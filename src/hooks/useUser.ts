import useSWR from 'swr';

export const fetcher = () => fetch('/api/auth/user').then((r) => r.json());

export function useUser() {
  const { data, mutate } = useSWR('user', fetcher);
  // if data is not defined, the query has not completed
  const loading = !data;
  let user = null;
  if (!data?.hasOwnProperty('error')) user = data?.user;
  return [user, { mutate, loading }];
}
