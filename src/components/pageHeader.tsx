import styles from 'styles/components/pageHeader.module.scss';
import { FunctionComponent, useContext } from 'react';
import { UserContext } from 'providers/userContextProvider';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export const PageHeader: FunctionComponent = () => {
  const { currentUser } = useContext(UserContext);
  const { theme, setTheme } = useTheme();

  return(
    <header className={styles.mainHeader}>
      <div className={`container ${styles.flexRow}`}>
        <div className={styles.logo}>
          <Link href='/'>CanWeCoop</Link>
          <select 
            value={theme} 
            name="theme2" 
            id="theme2"
            onChange={(e) => setTheme(e.target.value)}>
            <option value="system">System</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        { (currentUser)
          ? <>
            <div className={styles.user}>
              <Link href="/api/auth/logout">Logout</Link>
              <a className={styles.userimg} target="_blank" rel="noreferrer" href={currentUser.profileurl}>
                <Image src={currentUser.avatarfull} alt={currentUser.displayName} height={48} width={48} className={styles.profile} />
              </a>              
            </div>
          </>
          : <>
            <div className={styles.user}>
              <Link href="/api/auth/login">Login</Link>
            </div>
          </>
        }
      </div>
    </header>
  );
};
