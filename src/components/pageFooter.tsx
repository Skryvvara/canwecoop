import styles from 'styles/components/pageFooter.module.scss';
import { FunctionComponent } from 'react';

export const PageFooter: FunctionComponent = () => {

  return(
    <footer className={styles.mainFooter}>
      <ul className={styles.linkList}>
        <li>
          <a className='appLink' href="https://github.com/xdarkyne">GitHub</a>
        </li>
        <li>
          <a className='appLink' href="https://github.com/xdarkyne/canwecoop">Source</a>
        </li>
      </ul>
    </footer>
  );
};
