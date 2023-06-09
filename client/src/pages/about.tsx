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
        <h1>About CanWeCoop</h1>
        <section className="card pd-5">
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
          </article>
        </section>
      </div>
    </>
  );
}
