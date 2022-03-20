import styles from 'styles/components/pageHeader.module.scss';
import { FunctionComponent } from 'react';
import Link from 'next/link';
import { Navigation, User } from '.';
import { ThemeToggle } from 'components/themeToggle';

export const PageHeader: FunctionComponent = () => {
  return (
    <header className={styles.mainHeader}>
      <div className={`container ${styles.flexRow}`}>
        <div className={styles.logo}>
          <Link href="/">CanWeCoop</Link>
          <ThemeToggle />
        </div>
        <Navigation />
        <User />
      </div>
    </header>
  );
};
