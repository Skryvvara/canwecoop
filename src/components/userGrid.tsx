import { User } from '@prisma/client';
import { FunctionComponent } from 'react';
import { InfiniteData } from 'react-query';
import { UserCard } from './userCard';

interface IProps {
  data: InfiniteData<{
    users: (User & {
        followers: User[];
        following: User[];
    })[];
    nextCursor: string | null;
  }> | undefined
}

export const UserGrid: FunctionComponent<IProps> = ({ data }) => {

  return(
    <ul data-box="grid" data-col="6">
      {
        data?.pages.map((page) => (
          page.users?.map((user) => (
            <UserCard user={user} key={user.id} />
          ))
        ))
      }
    </ul>
  );
};
