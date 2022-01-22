import { FunctionComponent, useContext } from 'react';
import { UserContext } from 'providers/userContextProvider';

export const PageHeader: FunctionComponent = () => {
  const { user } = useContext(UserContext);

  return(
    <>
      <header>
        
      </header>
    </>
  );
};
