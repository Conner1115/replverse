/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import styles from '../styles/pages/Home.module.css'
import pos from '../styles/pos.module.css'
import ui from '../styles/ui.module.css'
import Nav from '../components/nav.js'
import Link from 'next/link'
import Footer from '../components/footer'
import { useEffect } from 'react';
import { Negative, Swal, showClass, hideClass } from '../scripts/modal';

function Feature(props) {
  return (<div className={styles.feature}>
    <img src={props.image} alt={props.title} className={styles.featureImg} />
    <div className={styles.featureCont}>
      <h2 style={{ paddingTop: 0 }}>{props.title}</h2>
      <p className={pos.blockP}>{props.desc}</p>
    </div>
  </div>)
}

export default function Home(props) {
  useEffect(() => {
    if(window.location !== window.parent.location){
      if(!localStorage.getItem("windowopen")){
        Swal.fire({
          allowEnterKey: false,
          allowOutsideClick: false,
          showClass, hideClass,
          title: "Hold Up there, buddy!",
          text: "Replverse only works in fullscreen.  Please allow repverse to open this in fullscreen before you can access it.",
          showCancelButton: false,
          confirmButtonText: "Open in Fullscreen",
          preConfirm: async () => {
            localStorage.setItem("windowopen", true)
            window.open("https://replverse.ironcladdev.repl.co")
          }
        });
      }
    }
  })
  return (
    <div className={styles.container}>
      <Head>
        <title>Home | Replverse</title>
      </Head>

      <section className={pos.relcont + " " + styles.bghead}>
        <div className={styles.header}>
          <div className={styles.headBlock}>

            <h1 className={styles.title}><span className={ui.glow}>Replit Apps<br />done</span>{' '}<span className={styles.headDescription} style={{ color: 'var(--accent-positive-stronger)', textShadow: '0 0 25px var(--accent-positive-stronger)' }}>Right</span></h1>

            <p style={{ margin: '20px 0' }}>Browse, learn, code, and communicate alongside over {props.memberCount} members at replverse.</p>

            <Link href="/signup" passHref>
              <button className={ui.actionButton + " " + ui.block}><ion-icon name="code"></ion-icon> Sign up Now</button>
            </Link>

          </div>
          <div className={styles.iwrap}>
            <img src="/logo.svg" alt="Replverse Logo" className={styles.illustration} />
          </div>
        </div>
      </section>

      <section style={{paddingBottom: 50}}>
        <video style={{
          width: '80%',
          position: 'relative',
          left: '50%',
          transform: 'translatex(-50%)',
          borderRadius: 10
        }} loop autoPlay muted>
          <source src="/vid.mp4"/>
        </video>
      </section>

      <section className={pos.relcont} style={{ background: 'linear-gradient(180deg, var(--background-default), var(--background-root))', padding: '50px 0' }}>
        <Feature image="/graphics/replsearch.svg" title="Search Engine" desc="The long-sought-after repl search engine is finally here!  Locate your favorite repls in a matter of seconds with the all-powerful search engine." />
        <Feature image="/graphics/quality.svg" title="Quality Repls" desc="The age of clickbait, scams, and low effort repls are over.  Open your eyes and see the true talent of the programmers of Replit." />
        <Feature image="/graphics/algorithm.svg" title="Enhanced Algorithm" desc="Repls no longer trend based off of forks or runs, neither do they trend for months at a time.  This algorithm is governed by what the community loves and updates relatively quickly.  Each and every repl gets a chance for some visibility." />
        <Feature image="/graphics/follow.svg" title="Following" desc="Stay updated with newly published repls from your favorite programmers and showcase your newest projects to your followers!" />
        <Feature image="/graphics/chat.svg" title="Live Chat" desc="Communicate in realtime with your fellow replers both synchronously and asynchronously, get live coding help, and more!" />
      </section>
      <section style={{ padding: '50px 0' }}>
        <h3 className={ui.header}>Take your coding to the next level</h3>
        <Link href="/signup" passHref>
          <button className={ui.actionButton + " " + pos.centerx}><ion-icon name="code"></ion-icon> Get Started</button>
        </Link>
      </section>
      <Footer/>

      <Nav />
    </div>
  )
}

export async function getServerSideProps({req, res}){
  let count = await fetch("https://" + req.headers.host + "/api/user/count").then(r => r.json())
  return {
    props: {
      memberCount: count
    }
  }
}