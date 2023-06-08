import styles from "@/styles/Contact.module.scss";
import { ContactForm } from "@/components";
import Link from "next/link";
import { Linkedin, Mail, Twitter } from "react-feather";

export default function Contact() {
  return (
    <div className="container">
      <h1>Contact</h1>
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
                <li className={styles.socialsMail}>
                  <Link href="/" title="Mail">
                    <Mail />
                  </Link>
                </li>
                <li className={styles.socialsTwitter}>
                  <Link href="/" title="Twitter">
                    <Twitter />
                  </Link>
                </li>
                <li className={styles.socialsLinkedIn}>
                  <Link href="/" title="LinkedIn">
                    <Linkedin />
                  </Link>
                </li>
              </ul>
            </section>
            <section aria-labelledby="imprint-title" className="card">
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
  );
}
