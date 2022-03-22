import { NextPage } from 'next';
import { createContext } from 'react';
import { useUser } from 'lib/hook';
import { User } from '@prisma/client';

export interface IUserContext {
  currentUser?: User & {
    followers: User[];
    following: User[];
  };
  mutate: Function;
  loading?: boolean;
}

export const UserContext = createContext<IUserContext>({ mutate: (key: string) => {} });

export const UserContextProvider: NextPage = ({children}) => {
  const [user, { mutate, loading }] = useUser();

  return (
    <UserContext.Provider value={{currentUser: user, mutate, loading}}>
      {children}
    </UserContext.Provider>
  );
};
