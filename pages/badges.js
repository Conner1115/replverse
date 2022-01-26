/* eslint-disable @next/next/no-img-element */
import DashNav from '../components/dashnav.js'
import styles from '../styles/pages/badges.module.css'
import Head from 'next/head'
export default function Badges(props){
  return (<div>
    <Head>
        <title>Badges | Replverse</title>
      </Head>
    <DashNav>
      <h3 style={{width: '90%', margin: 'auto', maxWidth: '1000px'}}>Badges</h3>
      <div className={styles.badgeGrid}>
      <div>
        Ancient Repler
        <img alt="badge" src="/badges/ancient.svg"/>
      </div>
      <div>
        Rookie (100)
        <img alt="badge" src="/badges/cycle-rookie.svg"/>
      </div>
      <div>
        Respected (500)
        <img alt="badge" src="/badges/cycle-respected.svg"/>
      </div>
      <div>
        Celebrity (1000)
        <img alt="badge" src="/badges/cycle-celebrity.svg"/>
      </div>
      <div>
        Legend (2K)
        <img alt="badge" src="/badges/cycle-legend.svg"/>
      </div>
      <div>
        Superstar (5K)
        <img alt="badge" src="/badges/cycle-superstar.svg"/>
      </div>
      <div>
        Megastar (7.5K)
        <img alt="badge" src="/badges/cycle-megastar.svg"/>
      </div>
      <div>
        Cycle Father (10K)
        <img alt="badge" src="/badges/cycle-father.svg"/>
      </div>
      <div>
        Developer
        <img alt="badge" src="/badges/dev.svg"/>
      </div>
      <div>
        Digest Writer
        <img alt="badge" src="/badges/digest.svg"/>
      </div>
      <div>
        Loyal Repler
        <img alt="badge" src="/badges/loyal-repler.svg"/>
      </div>
      <div>
        Replit Team
        <img alt="badge" src="/badges/replit-team.svg"/>
      </div>
      <div>
        Replverse Admin
        <img alt="badge" src="/badges/replverse-admin.svg"/>
      </div>
      </div>
    </DashNav>
  </div>)
}