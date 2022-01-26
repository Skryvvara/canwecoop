import { NextPage } from 'next';
import { createContext } from 'react';
import { useUser } from 'lib/hook';
import { User } from '@prisma/client';

export interface IUserContext {
  currentUser?: User;
  loading?: boolean;
}

export const UserContext = createContext<IUserContext>({});

export const UserContextProvider: NextPage = ({children}) => {
  const [user] = useUser();

  return (
    <UserContext.Provider value={{currentUser: user}}>
      {children}
    </UserContext.Provider>
  );
};
