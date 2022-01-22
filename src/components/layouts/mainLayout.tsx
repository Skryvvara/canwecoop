import type { NextPage } from 'next';
import { PageFooter } from 'components/pageFooter';
import { PageHeader } from 'components/pageHeader';

const MainLayout: NextPage = ({ children }) => {
  return(
    <>
      <PageHeader />
      <main>{children}</main>
      <PageFooter />
    </>
  );
};

export default MainLayout;
