import ui from '../styles/ui.module.css';
import styles from '../styles/components/repl.module.css'
import Link from 'next/link'

export default function Repl(props){
  return (<Link href={"/repl/" + props.slug} passHref><div className={styles.repl + " " + ui.boxDimSpaced}>
    <div className={styles.rstats}>
    <Link href={"/user/"+props.username} passHref>
      <div className={styles.userInfo}>
        <img src={props.avatar} className={styles.avatar}/>
        <div className={styles.username}>{props.username}</div>
      </div>
    </Link>
      <div style={{flexGrow: 1}}></div>
      <div className={styles.socialStats}>
        <span>{props.comments}{" "}<ion-icon name="chatbox-outline"></ion-icon></span>
  
        <span>{props.likes}{" "}<ion-icon name="heart-outline"></ion-icon></span>
      </div>
    </div>



    <div className={styles.cover} style={{backgroundImage: `url(${props.cover})`}}></div>



    <div className={styles.replInfo}>
      <h3 className={styles.title}>{props.title}</h3>
      <p className={styles.desc}>Lorem Ipsum Dolor Sit Amet This Is A Test Bunch Of Text And I Forgot The Rest Of Lorem Ipsum Dolor Sit Amet This Is A Test Bunch Of Text And I Forgot The Rest Of Lorem Ipsum Dolor Sit Amet This Is A Test Bunch Of Text And I Forgot The Rest Of Lorem Ipsum Dolor Sit Amet This Is A Test Bunch Of Text And I Forgot The Rest Of Lorem Ipsum Dolor Sit Amet This Is A Test Bunch Of Text And I Forgot The Rest Of Lorem Ipsum</p>
    <div className={styles.replTags}>
      {props.tags.map(tag => <span className={styles.tag} key={tag}>#{tag}</span>)}
    </div>
    </div>
  </div></Link>)
}