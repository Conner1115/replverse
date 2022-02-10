/* eslint-disable @next/next/no-img-element */
import ui from '../styles/ui.module.css';
import styles from '../styles/components/repl.module.css'
import Link from 'next/link'

export default function Repl(props){
  return (<Link href={"/repl/" + props.username + "/" + props.slug} passHref><div className={styles.repl + " " + ui.boxDimSpaced} style={{border: 'none'}}>
    <div className={styles.rstats}>
    <Link href={"/user/"+props.username} passHref>
      <div className={styles.userInfo}>
        <img alt="User Avatar" src={props.avatar} className={styles.avatar}/>
        <div className={styles.username}>{props.username}</div>
      </div>
    </Link>
      <div style={{flexGrow: 1}}></div>
      <div className={styles.socialStats}>
        <span>{props.comments}{" "}<ion-icon name="chatbox-outline"></ion-icon></span>
  
        <span>{props.likes}{" "}<ion-icon name="heart-outline"></ion-icon></span>

        <span>{props.views}{" "}<ion-icon name="eye-outline"></ion-icon></span>
      </div>
    </div>



    <div className={styles.cover} style={{backgroundImage: `url(${props.cover})`}}></div>



    <div className={styles.replInfo}>
      <h3 className={styles.title}>{props.title}</h3>
      <p className={styles.desc}><span>{props.desc || "This repl has no description"}<span style={{color: 'transparent'}}>{". ".repeat(100)}</span></span></p>
    <div className={styles.replTags}>
      {props.tags.map(tag => <span className={styles.tag} key={tag}>#{tag}</span>)}
    </div>
    </div>
  </div></Link>)
}