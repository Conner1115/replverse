/* eslint-disable @next/next/no-img-element */
import DashNav from '../../components/dashnav'
import styles from '../../styles/pages/dashboard.module.css'
import ui from '../../styles/ui.module.css'
import Link from 'next/link'
import Repl from '../../components/repl'
import Head from 'next/head'
import { App } from '../../scripts/mongo.js'
import follows from '../../data/follows.json'
import { useState } from 'react'
import reports from '../../data/reports.json'
import Error from '../../components/404.js'

let badgeTitles = {
  "ancient": "Be in the first million users of replit",
  "cycle-rookie": "Get 100 cycles on replit account",
  "cycle-respected": "Get 500 cycles on replit account",
  "cycle-celebrity": "Get 1000 cycles on replit account",
  "cycle-legend": "Get 2000 cycles on replit account",
  "cycle-superstar": "Get 5000 cycles on replit account",
  "cycle-megastar": "Get 7500 cycles on replit account",
  "cycle-father": "Get over 10000 cycles on replit account",
  "dev": "Be a developer of replverse",
  "digest": "Be a writer on digest.repl.co",
  "loyal-repler": "Loyal Repler is a specific role only given to some who have been active in the community and using replit for a while.",
  "replit-team": "Be a worker at replit",
  "replverse-admin": "Be an administrator in replverse"
}

export default function Dashboard(props){
  const [fd, updateF] = useState(follows)
  const [reps, setReports] = useState(reports);
  const dismissReport = (link) => {
    fetch("/api/dismissrepl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
      },
      body: JSON.stringify({
        link: link
      })
    }).then(r => r.json()).then(res => {
      if(res.success){
        setReports(res.data)
      } else{
        alert(res.message || "Internal Error.  Read the browser console for more information.");
        console.log(res.error);
      }
    })
  }
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
        alert(res.message || "Internal Error.  Read the browser console for more information.");
        console.log(res.error);
      }
    })
  }
  const warnUser = props.admin ? () => {
    let confirmWarn = confirm("Are you sure you would like to warn this user?")
    if(confirmWarn){
      let warning = prompt("Please provide a detailed message for the warning.  Make sure to include what violation they made and be nice.")
      fetch("/api/admin/warn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          user: props.username,
          message: warning
        })
      }).then(r => r.json()).then(res => {
        if(res.success){
          alert("User Warned");
        } else{
          alert(res.message || "Internal Error.  Read the browser console for more information.");
          console.log(res.error);
        }
      })
    }
  } : () => {};
  const purgeUser = props.admin ? () => {
    let question = confirm("Purging a user will delete all repls they've published and remove all their comments and followers on the site.  Are you sure you would like to perform this?");
    if(question){
      let warning = prompt("Please provide a reason why you are purging the account.")
      fetch("/api/admin/purge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          user: props.username,
          message: warning
        })
      }).then(r => r.json()).then(res => {
        if(res.success){
          alert("User Purged");
        } else{
          alert(res.message || "Internal Error.  Read the browser console for more information.");
          console.log(res.error);
        }
      })
    }
  } : () => {};
  const disableUser = props.admin ? () => {
    let question = confirm("Disabling a user will ban them by their account token and purge all their repls.  Are you sure you would like to do this?");
    if(question){
      let warning = prompt("Please provide a reason why you are disabling the account.");
      fetch("/api/admin/disable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          user: props.username,
          message: warning
        })
      }).then(r => r.json()).then(res => {
        if(res.success){
          alert("User Disabled");
        } else{
          alert(res.message || "Internal Error.  Read the browser console for more information.");
          console.log(res.error);
        }
      })
    }
  } : () => {};
  const banUser = props.admin ? () => {
    let question = confirm("Banning a user will ban them by their IP address (hashed in md5) as well as their token as well as purging all their repls.  Are you sure you would like to do this?");
    if(question){
      let warning = prompt("Please provide a reason why you are banning the account.")
      fetch("/api/admin/ban", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          user: props.username,
          message: warning
        })
      }).then(r => r.json()).then(res => {
        if(res.success){
          alert("User Banned");
        } else{
          alert(res.message || "Internal Error.  Read the browser console for more information.");
          console.log(res.error);
        }
      })
    }
  } : () => {};
  const giveBadge = (props.admin && props.daddy) ? () => {
    let question = confirm("Are you sure you would like to give this user a badge?");
    if(question){
      let badgeNum = prompt("Choose a number for the corresponding badge\n1. Loyal Repler\n2. Replverse Developer\n3. ReplDigest Author\n4. Replit Team")
      fetch("/api/admin/givebadge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          user: props.username,
          badge: badgeNum
        })
      }).then(r => r.json()).then(res => {
        if(res.success){
          alert("Badge Given");
        } else{
          alert(res.message || "Internal Error.  Read the browser console for more information.");
          console.log(res.error);
        }
      })
    }
  } : () => {};
  const deleteAccount = () => {
    let question = prompt("Warning!  Deleting your account will also remove all your published repls on this site! Are you sure you would like to continue?\n\nIf so, please type 'DELETE_MY_REPLVERSE_ACCOUNT'");
    if(question === "DELETE_MY_REPLVERSE_ACCOUNT"){
      fetch("/api/deleteacc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          question
        })
      }).then(r => r.json()).then(res => {
        if(res.success){
          location.href = "/"
        } else{
          alert(res.message || "Internal Error.  Read the browser console for more information.");
          console.log(res.error);
        }
      })
    }else{
      alert("Incorrectly typed.  Your account lives for another day!")
    }
  }
  return (
    <div>
    <Head>
      <title>{props.own ? "Dashboard" : props.username} | Replverse</title>
    </Head>
      {props.lost && <Error/>}
      {!props.lost && <DashNav>
      <div className={styles.container}>
          <div className={styles.columnLeft}>
          <div className={styles.userSec}>
            <h2 style={{paddingTop: 0, textAlign: 'center'}}>{props.username}</h2>
            <div className={styles.avatar}>
              <img src={props.avatar} alt="User Avatar"/>
            </div>
            <div className={styles.bio}>
              <p style={{textAlign: 'center'}}>{props.bio}</p>
            </div>
            <div>
              {props.own ? <div>
                <button onClick={deleteAccount} style={{width: '100%'}} className={ui.uiButtonDanger + " " + ui.block}>Delete Account</button>
              </div> : <button onClick={followUser} className={(fd.filter(x => x.user+x.follow === props.me+props.username)[0] ? ui.actionButtonDark : ui.actionButton) + " " + ui.block + " " + styles.followBtn}>{fd.filter(x => x.user+x.follow === props.me+props.username)[0] ? "Unfollow" : "Follow"}</button>}

              {(props.admin) && <details style={{
                background: 'var(--background-higher)',
                padding: 10,
                borderRadius: 5,
                border: 'solid var(--outline-dimmer) 1px',
                cursor: 'pointer',
                userSelect: 'none',
                margin: '20px 0'
              }}>
                <summary>Admin Options</summary>
                <div>
                {props.daddy && <button onClick={giveBadge} style={{width: '100%'}} className={ui.uiButton + " " + ui.block}>Give Badge</button>}
                <button onClick={warnUser} style={{width: '100%'}} className={ui.uiButtonDanger + " " + ui.block}>Warn User</button>
                <button onClick={purgeUser} style={{width: '100%'}} className={ui.uiButtonDanger + " " + ui.block}>Purge Repls</button>
                <button onClick={disableUser} style={{width: '100%'}} className={ui.uiButtonDanger + " " + ui.block}>Disable Account (Token)</button>
                <button onClick={banUser} style={{width: '100%'}} className={ui.uiButtonDanger + " " + ui.block}>IP ban + Disable account</button>
              </div></details>}
            </div>
{props.followers.length > 0 && <div><h3 style={{marginBottom: 15, fontSize: '1.75em'}}>Followers ({props.followers.length})</h3>
            <div className={ui.boxDimDefault + " " + styles.userGrid}>
              {props.followers.slice(0, 20).map(x => <div key={Math.random()} className={styles.gridUser}>
                <Link href={"/user/"+x.user} passHref>
                <img src={x.userAvatar} alt="User Avatar"/>
                </Link>
              </div>)}
              <div style={{width:50,height:50,verticalAlign: 'middle',textAlign: 'center',fontSize:18,paddingTop: 12}}>{props.followers.length > 20 &&`+${props.followers.length - 20}`}</div>
                
            </div></div>}
                {props.following.length > 0 && <div><h3 style={{marginBottom: 15, fontSize: '1.75em'}}>Following ({props.following.length})</h3>
            <div className={ui.boxDimDefault + " " + styles.userGrid}>
              {props.following.slice(0, 20).map(x => <div key={Math.random()} className={styles.gridUser}>
                <Link href={"/user/"+x.follow} passHref>
                <img src={x.avatar} alt="User Avatar"/>
                </Link>
              </div>)}
              <div style={{width:50,height:50,verticalAlign: 'middle',textAlign: 'center',fontSize:18,paddingTop: 12}}>{props.following.length > 20 &&`+${props.following.length - 20}`}</div>
            </div></div>}

                {props.admin && <div>
                  <h3 style={{fontSize: '1.75em'}}>Reported Repls</h3>

                 {reps.map(x => <div key={Math.random()} className={styles.report}>
                    <div style={{display: 'flex'}}>
                    <span style={{alignSelf: 'center'}}><strong>{x[2]}</strong></span>
                              
                      <div style={{alignSelf: 'center', flexGrow: 1, marginLeft: 'auto'}}>
                              <div style={{width:'100%'}}>
                              <div style={{display: 'flex', float: 'right'}}>
                        <a href={x[0]} target="_blank" rel="noreferrer">
                         <button className={ui.uiButton} style={{margin: 0, marginRight: 10, flexGrow: 1}}>View</button>
                       </a>
                   <button style={{margin: 0}} className={ui.uiButtonDark} onClick={() => dismissReport(x[0])}>Dismiss</button></div>
                   </div>
                   </div>
                   
                   </div>
                   <div style={{marginTop: 10}}><strong>Reason</strong> - {x[1]}</div>
                </div>)}
                </div>}
          </div>
        </div>


        {/*RIGHT COLUMN*/}      
                
                
        <div className={styles.columnRight}>
          {props.badges.length > 0 && <div className={ui.boxDimDefault}>
            <h3 style={{padding: 0, marginBottom: 20}}>Badges</h3>
            <div className={styles.badgeGrid}>
              {props.badges.map(x => <div key={Math.random()} className={styles.gridBadge} onClick={() => {alert(badgeTitles[x[1]])}}>
              <img alt={x[0] + " badge"} src={"/badges/" + x[1] + ".svg"}/>
              <div>{x[0]}</div>
            </div>)}
          </div></div>}



          {props.repls.length > 0 && <div className={styles.replGrid}>
                {props.repls.map(r => <Repl key={Math.random()} desc={r.desc} username={r.creator} avatar={r.avatar} comments={r.comments} likes={r.likes} cover={r.cover} title={r.title} slug={r.slug} views={r.views} tags={r.tags}/>)}
          </div> }    
          {props.repls.length === 0 && <div style={{textAlign: 'center', marginTop: 20, fontSize: 25, fontStyle: 'italic', color: 'var(--foreground-dimmer)'}}>No repls yet.  {props.own && "Let's change that!"}</div>}
        </div>
      </div>
       </DashNav>}
    </div>
  )
}

export async function getServerSideProps({ params, req, res }){
  if(req.headers["x-replit-user-name"] && req.cookies.sid){
    let rs = await fetch("https://" + req.headers.host + "/api/user/" + params.username)
  let badges = await fetch("https://" + req.headers.host + "/api/badges/" + params.username).then(r => r.json());
  let data = await rs.json()
  if(data.exists){
    let repls = await App.find({ user: params.username })
    return {
      props: {
        daddy: JSON.parse(process.env.SUPERIOR_ADMINS).includes(req.headers["x-replit-user-name"]),
        userIsAdmin: JSON.parse(process.env.ADMINS).includes(data.usernam),
        admin: JSON.parse(process.env.ADMINS).includes(req.headers["x-replit-user-name"]),
        own: req.headers["x-replit-user-name"] === data.username,
        me: req.headers["x-replit-user-name"],
        lost: false,
        bio: data.bio,
        avatar: data.icon.url,
        following: follows.filter(x => x.user === data.username) || [],
        followers: follows.filter(x => x.follow === data.username),
        badges,
        username: data.username,
        repls: repls.map(x => ({
          creator: x.user,
          avatar: x.avatar,
          comments: x.comments.length,
          likes: x.likes,
          cover: x.cover,
          title: x.repl,
          views: x.views,
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
  }else{
    return {
      redirect: {
      destination: "/login"
      }
    }
  }
}