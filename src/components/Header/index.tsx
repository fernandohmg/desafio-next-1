import styles from './header.module.scss';
import Link from 'next/link';

export default function Header() {
  return (
    <header className={styles.headerContainer} title="Home">
      <Link href="/">
        <button type="button">
          <img src="/images/logo.svg" alt="logo" />
        </button>
      </Link>
    </header>
  );
}
