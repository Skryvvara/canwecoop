import styles from "@/styles/Contact.module.scss";
import { ContactForm } from "@/components";
import Link from "next/link";
import { Linkedin, Mail, Twitter } from "react-feather";
import Head from "next/head";
import { useClientConfig } from "@/hooks";

export default function Contact() {
  const { socials } = useClientConfig();

  return (
    <>
      <Head>
        <title>Contact | CanWeCoop</title>
        <meta name="description" content="Find out how to contact us!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <header className="main-header">
          <h1>Contact</h1>
        </header>
        <div className="half-grid">
          <section aria-labelledby="form-title" className={styles.section}>
            <h2 id="form-title">Send us a message!</h2>
            <ContactForm />
          </section>
          <section
            aria-labelledby="alternatives-title"
            className={styles.section}
          >
            <h2 id="alternatives-title">Socials & Imprint</h2>
            <div className={styles.sideBar}>
              <section aria-labelledby="socials-title" className="card">
                <h3 id="socials-title">Socials</h3>
                <ul className={styles.socials}>
                  {socials.mail && (
                    <li className={styles.socialsMail}>
                      <Link href={`mailto:${socials.mail}`} title="Mail">
                        <Mail />
                      </Link>
                    </li>
                  )}
                  {socials.twitter && (
                    <li className={styles.socialsTwitter}>
                      <Link
                        href={socials.twitter}
                        target="_BLANK"
                        rel="noreferrer"
                        title="Twitter"
                      >
                        <Twitter />
                      </Link>
                    </li>
                  )}
                  {socials.linkedIn && (
                    <li className={styles.socialsLinkedIn}>
                      <Link
                        href={socials.linkedIn}
                        target="_BLANK"
                        rel="noreferrer"
                        title="LinkedIn"
                      >
                        <Linkedin />
                      </Link>
                    </li>
                  )}
                </ul>
              </section>
              <section
                aria-labelledby="imprint-title"
                className={`${styles.imprint} card`}
              >
                <h3 id="imprint-title">Imprint</h3>
                <p>Dimitri Kaiser</p>
                <p>Schlesienstraße 11</p>
                <p>97828 Marktheidenfeld</p>
                <p>Germany</p>
              </section>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
