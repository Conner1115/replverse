/* eslint-disable @next/next/no-img-element */
import styles from '../styles/components/footer.module.css';
import ui from '../styles/ui.module.css'
import Link from 'next/link';
export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.flexGroup}>
        <div className={styles.linkCol}>
          <div>
            <Link href="/">Home</Link>
          </div>
          <div>
            <Link href="/about">About</Link>
          </div>
          <div>
            <Link href="/apps">Discover</Link>
          </div>
        </div>
        <div className={styles.linkCol}>
          <div>
            <Link href="/login">Log In</Link>
          </div>
          <div>
            <Link href="/signup">Sign Up</Link>
          </div>
          <div>
            <a href="https://digest.repl.co" target="_blank" rel="noreferrer">Learn</a>
          </div>
        </div>
        <div className={styles.linkCol}>
          <div>
            <Link href="/rules">Rules</Link>
          </div>
          <div>
            <Link href="/discord">Discord</Link>
          </div>
        </div>
      </div>
    </div>
  )
}