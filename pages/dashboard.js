import DashNav from '../components/dashnav'
import styles from '../styles/pages/dashboard.module.css'
import ui from '../styles/ui.module.css'
import Link from 'next/link'
import Repl from '../components/repl'
import Head from 'next/head'
export default function Dashboard(props){
  return (
    <div>
    <Head>
      <title>Dashboard | Replverse</title>
    </Head>
      <DashNav>
      <div className={styles.container}>
          <div className={styles.columnLeft}>
          <div className={styles.userSec}>
            <h2 style={{paddingTop: 0, textAlign: 'center'}}>{props.username}</h2>
            <div className={styles.avatar}>
              <img src={props.avatar}/>
            </div>
            <div className={styles.bio}>
              <p style={{textAlign: 'center'}}>{props.bio}</p>
            </div>
            <div>
              <button className={ui.actionButton + " " + ui.block + " " + styles.followBtn}>+ Follow</button>
            </div>
  <h3 style={{marginBottom: 15}}>Followers ({props.followers.length})</h3>
            <div className={ui.boxDimDefault + " " + styles.userGrid}>
              {props.followers.slice(0, 20).map(x => <div key={Math.random()} className={styles.gridUser}>
                <Link href={"/user/"+x[0]} passHref>
                <img src={x[1]}/>
                </Link>
              </div>)}
              <div style={{width:50,height:50,verticalAlign: 'middle',textAlign: 'center',fontSize:18,paddingTop: 12}}>{props.followers.length > 20 &&`+${props.followers.length - 20}`}</div>
                
            </div>
                <h3 style={{marginBottom: 15}}>Following ({props.following.length})</h3>
            <div className={ui.boxDimDefault + " " + styles.userGrid}>
              {props.following.slice(0, 20).map(x => <div key={Math.random()} className={styles.gridUser}>
                <Link href={"/user/"+x[0]} passHref>
                <img src={x[1]}/>
                </Link>
              </div>)}
              <div style={{width:50,height:50,verticalAlign: 'middle',textAlign: 'center',fontSize:18,paddingTop: 12}}>{props.following.length > 20 &&`+${props.following.length - 20}`}</div>
            </div>
          </div>
        </div>


        {/*RIGHT COLUMN*/}      
                
                
        <div className={styles.columnRight}>
          <div className={ui.boxDimDefault + " " + styles.badgeGrid}>
          <h3 style={{padding: 0}}>Badges</h3>
              {props.badges.map(x => <div key={Math.random()} className={styles.gridBadge}>
                <img src={x[1]}/>
                <div>{x[0]}</div>
              </div>)}
          </div>



          <div className={styles.replGrid}>
                {props.repls.map(r => <Repl key={Math.random()} username={r.creator} avatar={r.avatar} comments={r.comments} likes={r.likes} cover={r.cover} title={r.title} slug={r.slug} tags={r.tags}/>)}
          </div>      
        </div>
      </div>
       </DashNav>
    </div>
  )
}

export async function getServerSideProps({ req, res }){
  return {
    props: {
      bio: "Lorem Ipsum Dolor Sit Amet this is a bunch of test text that goes in a user bio fetched from api",
      avatar: "/user.svg",
      following: new Array(15).fill(["user0", "/user.svg"]),
      followers: new Array(35).fill(["user1", "/user.svg"]),
      badges: new Array(5).fill(["Badge", "/graphics/badge.svg"]),
      username: "Username",
      repls: new Array(10).fill({
        creator: "Username",
        avatar: "/user.svg",
        comments: 5,
        likes: 15,
        cover: "/graphics/image.svg",
        title: "Repl Title",
        tags: ["javascript", "console", "game", "apps", "fun"],
        slug: "testslug"
      })
    }
  }
}