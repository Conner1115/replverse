/* eslint-disable @next/next/no-img-element */
import DashNav from '../../components/dashnav'
import styles from '../../styles/pages/dashboard.module.css'
import ui from '../../styles/ui.module.css'
import Link from 'next/link'
import Repl from '../../components/repl'
import Head from 'next/head'
import { App } from '../../scripts/mongo.js'
import { useState, useEffect } from 'react'
import Error from '../../components/404.js'
import { getData } from '../../scripts/json.js'
import {Negative, Positive, Swal, showClass, hideClass, Mod} from '../../scripts/modal'


let badgeTitles = {
  "ancient": "Be in the first million users of replit",
  "olden": "Be in the first 2.5 million users of replit",
  "early": "Be in the first 5 million users of replit",
  "modern": "Join replit after the 5-millionth user",

  "hacker": "Be subscribed to replit's hacker plan",
  "explorer": "Be an explorer in replit",
  
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
  "replverse-admin": "Be an administrator in replverse",
  "replitmod": "Be a replit moderator",

  "p25":"Get 25 upvotes on a post or shared repl",
  "p50":"Get 50 upvotes on a post or shared repl",
  "p100":"Get 100 upvotes on a post or shared repl",
  "p250":"Get 250 upvotes on a post or shared repl",
  "p500":"Get 500 upvotes on a post or shared repl",
  "p750":"Get 750 upvotes on a post or shared repl",
  "p1000":"Get 1000 upvotes on a post or shared repl",
  "p2000":"Get 2000 upvotes on a post or shared repl",
    
  "r10":"Have 10 public repls on your replit account",
  "r25":"Have 25 public repls on your replit account",
  "r50":"Have 50 public repls on your replit account",
  "r100":"Have 100 public repls on your replit account",
  "r200":"Have 200 public repls on your replit account",
    
  "social":"Post five things to ReplTalk/Community",
  "active":"Post ten things to ReplTalk/Community",
  "enthusiastic":"Post twenty things to ReplTalk/Community",
  "community-dude":"Post fifty things to ReplTalk/Community",

  "beta": "Be an official beta tester of replverse",
  "inspire": "One of your requests is added to replverse",
  "contributor": "Code or fix a portion of replverse"
}

export default function Dashboard(props){
  const [fd, updateF] = useState(props.following)
  const [reps, setReports] = useState(props.reports);
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
        Negative.fire(res.message || "Internal Error");
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
        Negative.fire(res.message || "Internal Error");
        console.log(res.error);
      }
    })
  }
  const warnUser = props.admin ? () => {
    Swal.fire({
      showCloseButton: true,
      allowOutsideClick: false,
      showClass, hideClass,
      title: "Warn User?",
      text: "Are you sure you would like to warn this user?",
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: false,
      denyButtonText: '<ion-icon name="flash-outline"></ion-icon> Yes, warn user',
      preDeny: async () => {
        
      const { value: warning } = await Swal.fire({
          title: 'Provide Reason',
          text: "Please provide a reason of why you are warning this user.",
          input: 'text',
          showClass, hideClass,
          confirmButtonText: "Send Warning",
          inputPlaceholder: "Reason (10 words or less)",
          showCancelButton: true,
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Reason is required'
            }
          }
        })
        if(warning){
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
          Positive.fire("User Warned");
        } else{
          Negative.fire(res.message || "Internal Error");
          console.log(res.error);
        }
      })
        }
      }})
  } : () => {};
  const purgeUser = props.admin ? () => {
    Swal.fire({
      showCloseButton: true,
      allowOutsideClick: false,
      showClass, hideClass,
      title: "Purge User?",
      text: "Are you sure you would like to warn this user?  This will unpublish all their repls and remove all their followers.",
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: false,
      denyButtonText: '<ion-icon name="flame-outline"></ion-icon> Yes, purge user',
      preDeny: async () => {
      const { value: warning } = await Swal.fire({
          title: 'Provide Reason',
          text: "Please provide a reason of why you are purging this user.",
          input: 'text',
          showClass, hideClass,
          confirmButtonText: "Purge Account",
          inputPlaceholder: "Reason (10 words or less)",
          showCancelButton: true,
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Reason is required'
            }
          }
        })
        if(warning){
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
          Positive.fire("User Purged");
        } else{
          Negative.fire(res.message || "Internal Error");
          console.log(res.error);
        }
      })
        }
    }})
  } : () => {};
  const disableUser = props.admin ? () => {
    Swal.fire({
      showCloseButton: true,
      allowOutsideClick: false,
      showClass, hideClass,
      title: "Disable User?",
      text: "Are you sure you would like to disable this user?  This will purge and prevent their account from performing any actions.",
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: false,
      denyButtonText: '<ion-icon name="close-outline"></ion-icon> Yes, disable user',
      preDeny: async () => {
      const { value: warning } = await Swal.fire({
          title: 'Provide Reason',
          text: "Please provide a reason of why you are disabling this user.",
          input: 'text',
          showClass, hideClass,
          confirmButtonText: "Disable Account",
          inputPlaceholder: "Reason (10 words or less)",
          showCancelButton: true,
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Reason is required'
            }
          }
        })
        if(warning){
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
          Positive.fire("User Disabled");
        } else{
          Negative.fire(res.message || "Internal Error");
          console.log(res.error);
        }
      })
        }
    }})
  } : () => {};
  const banUser = props.admin ? () => {
    Swal.fire({
      showCloseButton: true,
      allowOutsideClick: false,
      showClass, hideClass,
      title: "IP Ban User?",
      text: "Are you sure you would like to IP ban this user?  This will purge, disable, and IP ban their account from replverse.",
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: false,
      denyButtonText: '<ion-icon name="close-circle-outline"></ion-icon> Yes, IP ban user',
      preDeny: async () => {
      const { value: warning } = await Swal.fire({
          title: 'Provide Reason',
          text: "Please provide a reason of why you are banning this user.",
          input: 'text',
          showClass, hideClass,
          confirmButtonText: "IP Ban User",
          inputPlaceholder: "Reason (10 words or less)",
          showCancelButton: true,
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Reason is required'
            }
          }
        })
        if(warning){
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
          Positive.fire("User Banned");
        } else{
          Negative.fire(res.message || "Internal Error");
          console.log(res.error);
        }
      })
        }
    }})
  } : () => {};
  const giveBadge = (props.admin && props.daddy) ? () => {
    Swal.fire({
      showCloseButton: true,
      allowOutsideClick: false,
      showClass, hideClass,
      title: "Give Badge?",
      text: "Are you sure you would like to give this use a badge?",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: '<ion-icon name="trophy-outline"></ion-icon> Yes, give badge',
      preConfirm: async () => {
      const { value: badgeNum } = await Swal.fire({
          title: 'Provide Reason',
          html: "Choose a number for the corresponding badge.<br>1. Loyal Repler<br>2. Replit Team<br>3. Replit Moderator<br>4. Beta Tester<br>5. Contributor<br>6. Inspirer",
          input: 'text',
          showClass, hideClass,
          confirmButtonText: "Give Badge",
          inputPlaceholder: "Badge (number)",
          showCancelButton: true,
          showConfirmButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Badge Number is required'
            }
          }
        })
        if(badgeNum){
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
          Positive.fire("Badge Given");
        } else{
          Negative.fire(res.message || "Internal Error");
          console.log(res.error);
        }
      })}
    }})
  } : () => {};
  const deleteAccount = async () => {
    const { value: question } = await Swal.fire({
      returnInputValueOnDeny: true,
          showCloseButton: true,
      allowOutsideClick: false,
          title: 'Delete Account?',
          text: `In order to delete your replverse account, type the phrase "DELETE_MY_REPLVERSE_ACCOUNT" in the box.`,
          input: 'text',
          showClass, hideClass,
      showConfirmButton: false,
          denyButtonText: '<ion-icon name="trash-outline"></ion-icon> Yes, Delete Account',
      showDenyButton: true,
          inputPlaceholder: "DELETE_MY_REPLVERSE_ACCOUNT",
          showCancelButton: true
        })
    console.log(question)
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
          Negative.fire(res.message || "Internal Error");
          console.log(res.error);
        }
      })
    }else{
      Negative.fire("Incorrectly typed.  Your account lives for another day!")
    }
  }

  const onboard = () => {
    Swal.fire({
      confirmButtonText: "Next",
      title: "Welcome!",
      text: "Welcome to Replverse!  In this guide, you will be walked through all the main features replverse has to offer.  Click Next to get started!",
      preConfirm: () => {
  
        Swal.fire({
          showConfirmButton: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          allowOutsideClick: false,
          backdrop: false,
          title: "Publishing a Repl",
          position: "center-start",
          text: "Let's publish your first repl.  Open the sidebar and click the \"Share a Repl\" button on the navigation bar to start and select one of yours.",
          willClose: () => {
            document.cookie="newuser=2; path=/; Max-Age="+1000 * 60 * 60 * 24 * 365 * 10
          }
        })

        
      }
    })
  }

  useEffect(() => {
    const cookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift();
    if(+cookie("newuser") === 1){
      onboard();
    }
  }, [])
  
  return (
    <div>
    <Head>
      <title>{props.own ? "Dashboard" : props.username} | Replverse</title>
    </Head>
      {props.lost && <Error/>}
      {!props.lost && <DashNav page={props.own ? "dashboard" : ""}>
      <div className={styles.container}>
          <div className={styles.columnLeft}>
          <div className={styles.userSec}>
        
            <div className={styles.dtv + " " + ui.boxDimDefault} style={{marginTop: 0, marginBottom: 10, border: 'none'}}>
              <h2 className={styles.userNameHeader}>{props.username}</h2>
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
                cursor: 'pointer',
                userSelect: 'none',
                margin: '10px 0'
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
            </div>

        
            
{props.followers.length > 0 && 
            <div className={ui.boxDimCompact}  style={{border: 'none'}}>
              <h3 style={{marginBottom: 15, fontSize: '1.75em', padding: 0}}>Followers ({props.followers.length})</h3>
              <div className={styles.userGrid}>
                {props.followers.slice(0, 20).map(x => <div key={Math.random()} className={styles.gridUser} title={x.user}>
                  <Link href={"/user/"+x.user} passHref>
                  <img src={x.userAvatar} alt="User Avatar"/>
                  </Link>
                </div>)}
                </div>
              <div style={{width:50,height:50,verticalAlign: 'middle',textAlign: 'center',fontSize:18,paddingTop: 12}}>{props.followers.length > 20 &&`+${props.followers.length - 20}`}</div>
                
            </div>}



            {props.following.length > 0 && 
            <div className={ui.boxDimCompact}  style={{border: 'none',margin: '10px 0'}}>
              <h3 style={{marginBottom: 15, fontSize: '1.75em',padding:0}}>Following ({props.following.length})</h3>
              <div className={styles.userGrid}>
                {props.following.slice(0, 20).map(x => <div key={Math.random()} className={styles.gridUser} title={x.follow}>
                <Link href={"/user/"+x.follow} passHref>
                <img src={x.avatar} alt="User Avatar"/>
                </Link>
              </div>)}
                </div>
              <div style={{width:50,height:50,verticalAlign: 'middle',textAlign: 'center',fontSize:18,paddingTop: 12}}>{props.followers.length > 20 &&`+${props.following.length - 20}`}</div>
                
            </div>}

                {(props.admin && props.username === props.me && reps.length > 0) && <div className={ui.boxDimDefault} style={{border: 'none'}}>
                  <h3 style={{fontSize: '1.75em', padding: 0}}>Reported Repls</h3>

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
          <div className={styles.mv + " " + ui.boxDimDefault} style={{border: 'none', margin: 0, marginBottom: 10}}>
          <div className={styles.flexProfile}>
              <img className={styles.mvav} src={props.avatar} alt="User Avatar"/>
              <div>
                <h4 className={styles.mvname}>{props.username}</h4>
                <p className={styles.mvbio}>{props.bio}</p>
              </div>
          </div>
          <div style={{maxWidth: 400, margin: 'auto'}}>
              {props.own ? <div>
                <button onClick={deleteAccount} style={{width: '100%'}} className={ui.uiButtonDanger + " " + ui.block}>Delete Account</button>
              </div> : <button onClick={followUser} className={(fd.filter(x => x.user+x.follow === props.me+props.username)[0] ? ui.actionButtonDark : ui.actionButton) + " " + ui.block + " " + styles.followBtn}>{fd.filter(x => x.user+x.follow === props.me+props.username)[0] ? "Unfollow" : "Follow"}</button>}

              {props.admin && <details style={{
                background: 'var(--background-higher)',
                padding: 10,
                borderRadius: 5,
                border: 'none',
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
          
            </div>
          
          {props.badges.length > 0 && <div className={ui.boxDimDefault} style={{border: 'none'}}>
            <h3 style={{padding: 0, marginBottom: 20}}>Badges</h3>
            <div className={styles.badgeGrid}>
              {props.badges.map(x => <div key={Math.random()} className={styles.gridBadge} onClick={() => {
                Swal.fire({
                  title: x[0],
                  html: x[1].includes("http") ? `Be an active programmer in ${x[0]} on replit` : badgeTitles[x[1]],
                  showCancelButton: false,
                  confirmButtonText: "Close",
                  showCloseButton: true
                })
              }}>
              <img alt={x[0] + " badge"} src={x[1].includes("http") ? x[1] : ("/badges/" + x[1] + ".svg")}/>
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
  let badges = await fetch("https://" + req.headers.host + "/api/badges/" + params.username).then(r => r.json())
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
        reports: JSON.parse(process.env.ADMINS).includes(req.headers["x-replit-user-name"]) ? (await getData("reports.json", {}) || []) : [],
        following: await getData("follows.json", { user: data.username }) || [],
        followers: await getData("follows.json", { follow: data.username }) || [],
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