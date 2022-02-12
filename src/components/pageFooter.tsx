import styles from 'styles/components/pageFooter.module.scss';
import { FunctionComponent } from 'react';
import Link from 'next/link';

export const PageFooter: FunctionComponent = () => {

  return(
    <footer className={styles.mainFooter}>
      <div className={'container'}>
        <ul className={styles.footerLinks}>
          <li><a href='https://github.com/xDarkyne/canwecoop' target='_blank' rel='noreferrer'>Source</a></li>
          <li><a href='https://github.com/xDarkyne/' target='_blank' rel='noreferrer'>My Github</a></li>
          <li><Link href={'/about#data'}>Data usage</Link></li>
          <li><a href='https://github.com/users/xDarkyne/projects/3/views/5' target='_blank' rel='noreferrer'>Roadmap</a></li>
          <li><Link href='/about'>About</Link></li>
          <li><a href='https://darkyne.betteruptime.com' target='_blank' rel='noreferrer'>Status</a></li>
        </ul>

        <p>Copyright &copy; 2022 <a href='https://darkyne.com'>Darkyne</a></p>
      </div>
    </footer>
  );
};
