import styles from 'styles/components/pageFooter.module.scss';
import { FunctionComponent } from 'react';
import Link from 'next/link';

export const PageFooter: FunctionComponent = () => {

  return(
    <footer className={styles.mainFooter}>
      <div className={'container'}>
        <ul className={styles.footerLinks}>
          <li><a href='https://github.com/xdarkyne/canwecoop' target='_blank' rel='noreferrer'>Source</a></li>
          <li><a href='https://github.com/xdarkyne/' target='_blank' rel='noreferrer'>My Github</a></li>
          <li><Link href={'/about#data'}>Data usage</Link></li>
          <li><a href='' target='_blank' rel='noreferrer'>Roadmap</a></li>
          <li><Link href='/about'>About</Link></li>
        </ul>

        <p>Copyright &copy; 2022 <a href="https://darkyne.com">Darkyne</a></p>
      </div>
    </footer>
  );
};
