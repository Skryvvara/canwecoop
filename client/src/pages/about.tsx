import styles from "@/styles/About.module.scss";
import Head from "next/head";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Head>
        <title>About | CanWeCoop</title>
        <meta
          name="description"
          content="About CanWeCoop. Everything you need to know about CanWeCoop and how we use your data."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <header className="main-header">
          <h1>About CanWeCoop</h1>
        </header>
        <section className="card pd-10">
          <article className={styles.aboutSection}>
            <h2>What is CanWeCoop?</h2>
            <p>
              CanWeCoop is a &quot;search-engine&quot; for games. The goal of
              canwecoop is to make finding games you can play with your friends
              effortless by providing a nice interface to search trough your
              games.
            </p>
            <p>This is currently a hobby project made by one person - me.</p>
            <p>
              If you have more questions or want to contribute please send me a
              request via the <Link href={"/contact"}>contact page</Link>.
            </p>
          </article>

          <article className={styles.aboutSection}>
            <h2>How does CanWeCoop work?</h2>
            <p>
              To avoid get rate limited by steams api and provide a continuous
              service we have to cache the games so we do not fire too many
              requests against steam&apos;s API. So once you login a entry in
              the database is created containing your steam id, displayname and
              the url to your steam profile picture (and some other data like
              the date and time you logged in for the first time for example).
              There is a service called the &quot;sync service&quot; which runs
              in a defined interval to fetch the games of the users that have
              logged in at least once. If your games do not show up yet please
              wait for the sync service to run again. I am working on an
              implementation to show people when the next sync will run and/or
              allow them to start the sync manually.
            </p>
          </article>

          <article className={styles.aboutSection}>
            <h2>Can CanWeCoop access my steam credentials?</h2>
            <p>
              No. The login process is completely handled by steam. We do not
              have access to your steam credentials at any point.
            </p>
          </article>

          <article className={styles.aboutSection}>
            <h2>What data does CanWeCoop collect about me?</h2>
            <p>
              All the data we use is publicly available (as long as they are set
              to public on your steam profile). Setting some of the used
              information to private might lock you out of using CanWeCoop (e.g.
              hiding your owned games or friends). After logging in, we have
              access to the following data:
            </p>
            <ul className={styles.detailsList}>
              <li>
                <details>
                  <summary>Displayname, AvatarUrl & ProfileUrl</summary>
                  <p>
                    This is used for visual and technical purposes. Hint: We use
                    the displayname, not the account name (the name you login
                    with)
                  </p>
                </details>
              </li>
              <li>
                <details>
                  <summary>Friends</summary>
                  <p>
                    The friend list is used to provide the option to filter
                    games you and your friends have in common. Please note that
                    we only store data of friends that are also registered to
                    canwecoop.
                  </p>
                </details>
              </li>
              <li>
                <details>
                  <summary>Owned games</summary>
                  <p>
                    We need the list of games of our users to provide the
                    service we want to offer.
                  </p>
                </details>
              </li>
            </ul>
          </article>

          <article className={styles.aboutSection}>
            <h2>How can I request the deletion of my data?</h2>
            <p>
              To request the deletion of your data simply navigation to our{" "}
              <Link href={"/contact"}>contact page</Link> and send us a message
              via one of the provided channels of communication.
            </p>
            <p>
              I am working on a way so you can delete your data yourself without
              having to contact me, while this feature is in development please
              use the contact form as stated above.
            </p>
          </article>
        </section>
      </div>
    </>
  );
}
