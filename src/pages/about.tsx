import { trpc } from 'lib/trpc';
import type { NextPage } from 'next';
import Head from 'next/head';

const About: NextPage = () => {
  trpc.useQuery(['sync.missingGames', { key: '123' }]);

  return(
    <>
      <Head>
        <title>About | CanWeCoop</title>
        <meta name="description" content="CanWeCoop WIP stay tuned for updates!" />
      </Head>

      <div>
        WIP
      </div>
    </>
  );
};

export default About;
