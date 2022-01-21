import { NextPage } from 'next';
import { createContext } from 'react';
import { useUser } from '@/lib/.';
import { User } from '@prisma/client';

interface IUserContext {
  user?: User,
  mutate?: any,
  loading?: boolean
}

export const UserContext = createContext<IUserContext>({});

export const UserContextProvider: NextPage = ({children}) => {
  const [user, mutate, loading] = useUser();

  return (
    <UserContext.Provider value={{user: user, mutate: mutate, loading: loading}}>
      {children}
    </UserContext.Provider>
  );
};