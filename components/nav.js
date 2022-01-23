/* eslint-disable @next/next/no-img-element */
import styles from '../styles/components/nav.module.css'
import ui from '../styles/ui.module.css'
import Link from 'next/link';
import {useState} from 'react';
export default function Nav() {
  const [visible, toggle] = useState(true);
  return (
    <div className={styles.nav}>
      <Link href="/" passHref>
        <div className={styles.logoWrapper}>
          <img src="/logo.svg" alt="Replverse Logo" className={styles.logoImage} />
          <span className={styles.logoName}>Replverse</span>
          <img src="/graphics/arrow.svg" alt="Arrow Icon" className={styles.arrow} />
        </div>
      </Link>

      <div className={styles.links}>
        <Link href="/apps">Discover</Link>
        <Link href="/about">About</Link>
        <a target="_blank" rel="noreferrer" href="https://digest.repl.co">Learn</a>
      </div>

      <div className={styles.linksRight}>
        <Link href="/login" passHref>
          <button className={ui.uiButtonDark} style={{marginRight: 5}}>Log In</button>
        </Link>

        <Link href="/signup" passHref>
          <button className={ui.uiButton + " " + styles.signupButton}>Sign Up</button>
        </Link>
      </div>
    </div>
  )
}