import styles from 'styles/components/pageHeader.module.scss';
import { FunctionComponent } from 'react';
import Link from 'next/link';

export const Navigation: FunctionComponent = () => {
  return (
    <ul className={styles.navigation}>
      <li>
        <Link href="/">App</Link>
      </li>
      <li>
        <Link href="/users">Users</Link>
      </li>
      <li>
        <Link href="/about">About</Link>
      </li>
    </ul>
  );
};
