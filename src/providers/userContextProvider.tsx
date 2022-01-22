import { NextPage } from 'next';
import { createContext } from 'react';
import { useUser } from 'lib/hook';

export const UserContext = createContext<any>(null);

export const UserContextProvider: NextPage = ({children}) => {
  const [user] = useUser();

  return (
    <UserContext.Provider value={{user: user}}>
      {children}
    </UserContext.Provider>
  );
};
