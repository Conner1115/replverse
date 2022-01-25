import DashNav from '../../components/dashnav'
import styles from '../../styles/pages/dashboard.module.css'
import ui from '../../styles/ui.module.css'
import Link from 'next/link'
import Repl from '../../components/repl'
import Head from 'next/head'
import { App } from '../../scripts/mongo.js'
import follows from '../../data/follows.json'
import { useState } from 'react'

export default function Dashboard(props){
  const [fd, updateF] = useState(follows)
  const followUser = () => {
    fetch("/api/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
      },
      body: JSON.stringify({
        follow: props.username
      })
    }).then(r => r.json()).then(res => {
      if(res.success){
        updateF(res.data);
      } else{
        alert(res.message || "Internal Error.  Read the browser consold for more information.");
        console.log(res.error);
      }
    })
  }
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
              <button onClick={followUser} className={(fd.filter(x => x.user+x.follow === props.me+props.username)[0] ? ui.actionButtonDark : ui.actionButton) + " " + ui.block + " " + styles.followBtn}>{fd.filter(x => x.user+x.follow === props.me+props.username)[0] ? "Unfollow" : "Follow"}</button>
            </div>
{props.followers.length > 0 && <div><h3 style={{marginBottom: 15}}>Followers ({props.followers.length})</h3>
            <div className={ui.boxDimDefault + " " + styles.userGrid}>
              {props.followers.slice(0, 20).map(x => <div key={Math.random()} className={styles.gridUser}>
                <Link href={"/user/"+x.user} passHref>
                <img src={x.userAvatar}/>
                </Link>
              </div>)}
              <div style={{width:50,height:50,verticalAlign: 'middle',textAlign: 'center',fontSize:18,paddingTop: 12}}>{props.followers.length > 20 &&`+${props.followers.length - 20}`}</div>
                
            </div></div>}
                {props.following.length > 0 && <div><h3 style={{marginBottom: 15}}>Following ({props.following.length})</h3>
            <div className={ui.boxDimDefault + " " + styles.userGrid}>
              {props.following.slice(0, 20).map(x => <div key={Math.random()} className={styles.gridUser}>
                <Link href={"/user/"+x.follow} passHref>
                <img src={x.avatar}/>
                </Link>
              </div>)}
              <div style={{width:50,height:50,verticalAlign: 'middle',textAlign: 'center',fontSize:18,paddingTop: 12}}>{props.following.length > 20 &&`+${props.following.length - 20}`}</div>
            </div></div>}
          </div>
        </div>


        {/*RIGHT COLUMN*/}      
                
                
        <div className={styles.columnRight}>
          {props.badges.length > 0 && <div className={ui.boxDimDefault + " " + styles.badgeGrid}>
          <h3 style={{padding: 0}}>Badges</h3>
              {props.badges.map(x => <div key={Math.random()} className={styles.gridBadge}>
                <img src={x[1]}/>
                <div>{x[0]}</div>
              </div>)}
          </div>}



          <div className={styles.replGrid}>
                {props.repls.map(r => <Repl key={Math.random()} desc={r.desc} username={r.creator} avatar={r.avatar} comments={r.comments} likes={r.likes} cover={r.cover} title={r.title} slug={r.slug} tags={r.tags}/>)}
          </div>      
        </div>
      </div>
       </DashNav>
    </div>
  )
}

export async function getServerSideProps({ params, req, res }){
    let rs = await fetch("https://" + req.headers.host + "/api/user/" + params.username)
  let data = await rs.json()
  if(data){
    let repls = await App.find({ user: params.username })
    return {
      props: {
        me: req.headers["x-replit-user-name"],
        lost: false,
        bio: data.bio,
        avatar: data.icon.url,
        following: follows.filter(x => x.user === data.username),
        followers: follows.filter(x => x.follow === data.username),
        badges: [],
        username: data.username,
        repls: repls.map(x => ({
          creator: x.user,
          avatar: x.avatar,
          comments: x.comments.length,
          likes: x.likes,
          cover: x.cover,
          title: x.repl,
          tags: x.tags,
          slug: x.slug,
          desc: x.desc
        }))
      }
    }
  }else{
    return {
      props: {
        lost: true
      }
    }
  }
}