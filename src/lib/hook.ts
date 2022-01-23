import useSWR from 'swr';
import { Config } from './config';

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useUser() {
  const { data, mutate } = useSWR('/api/auth/user', fetcher);
  // if data is not defined, the query has not completed
  const loading = !data;
  const user = data?.user;
  return [user, { mutate, loading }];
}
