import styles from 'styles/components/pageHeader.module.scss';
import { FunctionComponent, useState } from 'react';
import Link from 'next/link';
import { Navigation, User } from '.';
import { ThemeToggle } from 'components/themeToggle';
import { FaBars } from 'react-icons/fa';

export const PageHeader: FunctionComponent = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.mainHeader}>
      <div className={`container ${styles.flexRow}`}>
        <div className={styles.logo}>
          <Link href="/">CanWeCoop</Link>
          <ThemeToggle />
        </div>
        <Navigation />
        <User />
        <div className={styles.mobile}>
          <button
            className={`${styles.mobileMenuToggle} appBtn`}
            onClick={() => setOpen(!open)}
          >
            <FaBars className='icon'/>
          </button>
          <div className={`${styles.mobileMenu} ${open ? styles.open : ''}`}>
            <Navigation />
            <User />
          </div>
        </div>
      </div>
    </header>
  );
};
