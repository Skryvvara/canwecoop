import styles from "@/styles/components/pageFooter.module.scss";

import { SyntheticEvent, useEffect } from "react";
export function PageFooter(e: SyntheticEvent) {
  const scrollToTop = () => {
    const body = document.querySelector("body");
    if (!body) return;

    body.scrollTo(0, 0);
  };

  return (
    <footer className={styles.footer}>
      <nav className={styles.scrollToTop}>
        <button onClick={scrollToTop}>Back to top</button>
      </nav>
      <div className="container">
        <p>Copyright</p>
      </div>
    </footer>
  );
}
