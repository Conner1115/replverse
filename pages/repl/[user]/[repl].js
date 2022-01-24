import DashNav from '../../../components/dashnav.js';
import Head from 'next/head';
import { App } from '../../../scripts/mongo.js'
import Error from '../../../components/404.js';
import styles from '../../../styles/pages/spotlight.module.css'
import ui from '../../../styles/ui.module.css'
import Replicon from '../../../components/replicon.js'
export default function Spotlight(props) {
  const app = JSON.parse(props.app);
  const author = JSON.parse(props.author);
  const applyLike = () => {
    alert("Liked Repl")
  }
  return (<div>
    <Head>
      <title>{props.lost ? "Not Found" : `${props.repl} by ${props.user}`}</title>
    </Head>
    {props.lost && <Error />}
    {!props.lost && <DashNav>
      <div style={{ padding: '50px 20px' }}>
        <div className={styles.flexBody}>
          <iframe src={`https://replit.com/@${props.user}/${props.repl}?embed=true`} className={styles.replFrame}></iframe>

          <div className={styles.replOptions}>
            <h3 style={{ padding: 0 }}>{props.repl}</h3>
            <a href={`https://replit.com/@${props.user}/${props.repl}?embed=true`} target="_blank" rel="noreferrer"><button className={ui.uiButton}>Fullscreen <ion-icon style={{ width: 15, height: 15, verticalAlign: 'middle', transform: 'translatey(-2px)' }} name="open-outline"></ion-icon></button></a>
            <a href={`https://replit.com/@${props.user}/${props.repl}`} target="_blank" rel="noreferrer"><button style={{ margin: '0 10px' }} className={ui.uiButton}>Open in Replit <Replicon /></button></a>
            <button onClick={applyLike} className={ui.uiButton}>{app.likes} <ion-icon style={{ width: 15, height: 15, verticalAlign: 'middle', transform: 'translatey(-2px)' }} name="heart-outline"></ion-icon></button>
          </div>
        </div>
      </div>
    </DashNav>}
  </div>)
}

export async function getServerSideProps(ctx) {
  let app = await App.findOne({ user: ctx.params.user, repl: ctx.params.repl });
  let author = await fetch("/api/user/" + ctx.params.user).then(r => r.json());
  if (app) {
    return {
      props: {
        user: ctx.params.user,
        repl: ctx.params.repl,
        app: JSON.stringify(app),
        author: JSON.stringify(author);
        lost: false
      }
    }
  } else {
    return {
      props: {
        lost: true
      }
    }
  }
}