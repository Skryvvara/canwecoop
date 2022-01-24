import styles from 'styles/components/pageFooter.module.scss';
import { FunctionComponent } from 'react';

export const PageFooter: FunctionComponent = () => {

  return(
    <footer className={styles.mainFooter}>
      <a href="https://github.com/xdarkyne">GitHub</a>
    </footer>
  );
};
