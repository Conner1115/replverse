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
        <img src="/badges/ancient.svg"/>
      </div>
      <div>
        Rookie (100)
        <img src="/badges/cycle-rookie.svg"/>
      </div>
      <div>
        Respected (500)
        <img src="/badges/cycle-respected.svg"/>
      </div>
      <div>
        Celebrity (1000)
        <img src="/badges/cycle-celebrity.svg"/>
      </div>
      <div>
        Legend (2K)
        <img src="/badges/cycle-legend.svg"/>
      </div>
      <div>
        Superstar (5K)
        <img src="/badges/cycle-superstar.svg"/>
      </div>
      <div>
        Megastar (7.5K)
        <img src="/badges/cycle-megastar.svg"/>
      </div>
      <div>
        Cycle Father (10K)
        <img src="/badges/cycle-father.svg"/>
      </div>
      <div>
        Developer
        <img src="/badges/dev.svg"/>
      </div>
      <div>
        Digest Writer
        <img src="/badges/digest.svg"/>
      </div>
      <div>
        Loyal Repler
        <img src="/badges/loyal-repler.svg"/>
      </div>
      <div>
        Replit Team
        <img src="/badges/replit-team.svg"/>
      </div>
      <div>
        Replverse Admin
        <img src="/badges/replverse-admin.svg"/>
      </div>
      </div>
    </DashNav>
  </div>)
}