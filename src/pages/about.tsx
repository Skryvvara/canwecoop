import { trpc } from 'lib/trpc';
import type { NextPage } from 'next';
import Head from 'next/head';

const About: NextPage = () => {
  trpc.useQuery(['sync.missingGames', { key: '123' }]);

  return (
    <>
      <Head>
        <title>About | CanWeCoop</title>
        <meta
          name="description"
          content="CanWeCoop WIP stay tuned for updates!"
        />
      </Head>

      <div className="container">
        <h1>About</h1>
        <p>
          he goal of CanWeCoop is to make finding coop games easy. Have you ever
          looked at your and your friends steam library side by side to see
          which games you both own and could play together? Yeah we too. This is
          very tedious and annoying. CanWeCoop wants to provide a huge list of
          games so people can either see which games they and their friends own
          to play together but also find new games to play. We want to create a
          easy usable library of games for primarily but not limited to coop
          games. Basically every time a user logs in he&apos;s
          &quot;registered&quot; for our service. On a regular schedule we sync
          the games of all users with our database. This procedure is necessary
          because of steams rate limit for the game detail api. All data
          collected is publicly available on steam and we don&apos;t (and
          don&apos;t want to) collect any sensitive data of our users.
        </p>

        <h1>Data Usage</h1>
        <p>WIP</p>
        <p>
          Collected data:
          <ul>
            <li>
              <h2>ip address</h2>
              <i>why?</i>
              <p>
                Your ip address is used for technical purposes like blocking
                malicious connections. Ip addresses are not used to profile
                users and are <b>not</b> shared with third parties.
              </p>
            </li>
            <li>
              <h2>public steam data (only when using login)</h2>
              <i>what data?</i>
              <ul>
                <li>steam username (public name, not login name)</li>
                <li>owned games</li>
                <li>steam friends</li>
              </ul>
              <i>why?</i>
              <p>
                because we need this data to provide the functionality of our
                service.
              </p>
            </li>
          </ul>
        </p>
      </div>
    </>
  );
};

export default About;
