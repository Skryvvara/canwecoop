import { UserGrid } from 'components/userGrid';
import { trpc } from 'lib/trpc';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { UserContext } from 'providers/userContextProvider';
import { useContext } from 'react';

const Users: NextPage = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const { name } = router.query ?? undefined;
  const users = trpc.useInfiniteQuery(
    ['allUsers', { limit: 48, name: name?.toString(), currentUserId: currentUser && currentUser.id }], {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      keepPreviousData: true
    },
  );
  const userCount = trpc.useQuery(['userCount'], { refetchOnWindowFocus: false });

  return(
    <>
      <Head>
        <title>Users | CanWeCoop</title>
        <meta name="description" content="CanWeCoop WIP stay tuned for updates" />
      </Head>

      <div className="container">
        <h1>We have a total of {userCount.data} users!</h1>
        <input type="text" placeholder='search' className='search' defaultValue={name} onChange={(e) => router.push((e.target.value) ? '/users/?name='+e.target.value : '/users')}/>
        { 
          (users.data?.pages[0].users.length != 0)
          ? <UserGrid data={users.data} />
          : <div> <h2>Oh no! These aren&#39;t the users you&#39;re looking for.</h2> </div>
        }

        { users.hasNextPage 
          ? <button className='loadMore' onClick={() => users.fetchNextPage()}>Load more</button> 
          : <></> 
        }
      </div>
    </>
  );
};

export default Users;
