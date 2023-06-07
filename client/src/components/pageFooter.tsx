import styles from "@/styles/components/pageFooter.module.scss";
import Link from "next/link";
import { SyntheticEvent } from "react";
import { ExternalLink } from "react-feather";

export function PageFooter() {
  const scrollToTop = () => {
    const body = document.querySelector("#__next");
    if (!body) return;

    body.scrollTo(0, 0);
  };

  return (
    <footer className={styles.footer}>
      <nav className={styles.scrollToTop}>
        <button onClick={scrollToTop}>Back to top</button>
      </nav>
      <div className="container">
        <nav className={styles.footerNav}>
          <section>
            <h3>Connect</h3>
            <ul>
              <li>
                <Link
                  className="iconLink"
                  href="https://github.com/skryvvara/canwecoop"
                  rel="noreferrer"
                  target="_BLANK"
                >
                  GitHub
                  <ExternalLink />
                </Link>
              </li>
              <li>
                <Link className="iconLink" href="/">
                  RoadMap
                  <ExternalLink />
                </Link>
              </li>
              <li>
                <Link className="iconLink" href="/">
                  Discord
                  <ExternalLink />
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h3>About</h3>
            <ul>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </section>
        </nav>
      </div>
    </footer>
  );
}
