import { User } from '@prisma/client';
import { useUser } from 'lib/hook';
import { trpc } from 'lib/trpc';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Users: NextPage = () => {
  const [currentUser] = useUser();
  const router = useRouter();
  const { name } = router.query ?? undefined;
  const users = trpc.useInfiniteQuery(
    ['allUsers', { limit: 48, name: name?.toString() }], {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      keepPreviousData: true
    },
  );
  const utils = trpc.useContext();

  const addFriend = trpc.useMutation('addFriend', {
    onSuccess() {
      utils.invalidateQueries('allUsers');
    }
  });
  const removeFriend = trpc.useMutation('removeFriend', {
    onSuccess() {
      utils.invalidateQueries('allUsers');
    }
  });
  const userCount = trpc.useQuery(['userCount'], { refetchOnWindowFocus: false });

  return(
    <>
      <Head>
        <title>Next Page</title>
        <meta name="description" content="Next Page" />
      </Head>

      <div className="container">
        <h1>We have a total of {userCount.data} users!</h1>
        <input type="text" placeholder='search' className='search' defaultValue={name} onChange={(e) => router.push('/users/?name='+e.target.value)}/>
        { 
          (users.data?.pages[0].users.length != 0)
          ? users.data?.pages.map((page) => (
            page.users?.map((user) => (
              <li key={user.id}>
                <Image src={user.avatarfull} alt={user.displayName} height={64} width={64} />
                <h2>{user.displayName}</h2>
                { (user.id != currentUser?.id)
                  ? (user.followers.findIndex((f) => f.id = currentUser?.id) == -1)
                    ? <button onClick={async(e) => addFriend.mutate({ id: user.id, currentId: currentUser.id })}>follow</button>
                    : <button onClick={async(e) =>  removeFriend.mutate({ id: user.id, currentId: currentUser.id })}>unfollow</button>
                  : <></>
                }
                
              </li>
            ))
          ))
          : <div>
            <h2>Oh no! These aren&#39;t the users you&#39;re looking for.</h2>
          </div>
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
