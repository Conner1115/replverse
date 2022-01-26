/* eslint-disable @next/next/no-img-element */
import DashNav from '../../../components/dashnav.js';
import Head from 'next/head';
import { App } from '../../../scripts/mongo.js'
import Error from '../../../components/404.js';
import styles from '../../../styles/pages/spotlight.module.css'
import ui from '../../../styles/ui.module.css'
import Replicon from '../../../components/replicon.js'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import rcs from '../../../data/records.json'
import fls from '../../../data/follows.json'
let follows = [...fls];
let records = [...rcs];

function Comment(props){
  const deleteComment = () => {
    let ask = confirm("Are you sure you would like to delete this comment?");
    if(ask){
      fetch("/api/delcom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          repl: props.repl,
          author: props.author,
          id: props.id
        })
      }).then(r => r.json())
      .then(res => {
        if(res.success){
          props.updateComments(res.data);
        }else{
          if(res.err){
            alert(res.message || "Internal Error.  Check the browser console for details.");
            console.log(res.err)
          }
        }
      })
    }
  }
  return (<div className={styles.comment}>
      <div className={styles.commentUserFlex}>
        <Link href={"/user/"+props.user} passHref><img className={styles.commentUserAvatar} alt="User Avatar" src={props.userAvatar}/></Link>
        <div>
          <Link href={"/user/"+props.user} passHref><span className={styles.commentUserName}>{props.user}</span></Link>
          <p className={styles.commentValue}>{props.value}</p>
          {props.me === props.user && <a href="#" style={{fontSize: 13, marginLeft: 5}} onClick={deleteComment}>delete</a>}
        </div>
      </div>
  </div>)
}

export default function Spotlight(props) {
  const [fd, updateF] = useState(follows)
  const [comment, updateComment] = useState("");
  const app = JSON.parse(props.app);
  const [comments, updateComments] = useState(app.comments);
  const [likes, updateLikes] = useState(app.likes);
  const [load, toggleLoad] = useState(false);
  const author = JSON.parse(props.author);
  const applyLike = () => {
    fetch("/api/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
      },
      body: JSON.stringify({
        repl: props.repl,
        author: props.user
      })
    }).then(r => r.json())
    .then(res => {
      if(res.success){
        updateLikes(likes + res.count);
      }else{
        if(res.err){
          alert(res.message || "Internal Error.  Check the browser console for details.");
          console.log(res.err)
        }
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
        follow: props.user
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
  const submitComment = () => {
    fetch("/api/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
      },
      body: JSON.stringify({
        value: comment,
        repl: props.repl,
        author: props.user
      })
    }).then(r => r.json())
    .then(res => {
      if(res.success){
        updateComment("");
        updateComments(res.data)
      }else{
        alert(res.message || "Internal Error.  Check the browser console for details.");
        console.log(res.err)
      }
    })
  }

  const removeRepl = (props.adminView) ? () => {
    let confirmWarn = confirm("Are you sure you would like to remove this repl?")
    if(confirmWarn){
      let warning = prompt("Please provide a reason of why this breaks the rules and why you are removing it.")
      fetch("/api/admin/remrepl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          user: props.user,
          repl: props.repl,
          message: warning
        })
      }).then(r => r.json()).then(res => {
        if(res.success){
          location.href = "/apps"
        } else{
          alert(res.message || "Internal Error.  Read the browser console for more information.");
          console.log(res.error);
        }
      })
    }
  } : () => {}

  const updateRepl = () => {
    toggleLoad(true);
    try{
    fetch("/api/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
      },
      body: JSON.stringify({
        repl: props.repl
      })
    }).then(r => r.json())
    .then(res => {
      if(res.success){
        location.reload();
        toggleLoad(false);
      }else{
        alert(res.message || "Internal Error.  Check the browser console for details.");
        console.log(res.err)
        toggleLoad(false);
      }
    })
    }catch(e){
      alert("Failed to reroll repl.  Please make sure it is running so that replverse can take a screenshot.");
      toggleLoad(false);
    }
  }
  const deleteRepl = () => {
    let q = confirm("Are you really absolutely assuredly sure that you would like to delete this repl from Replverse? (this won't effect your actual replit account.   It will just be unpublished from here)");
    if(q){
      fetch("/api/deleterepl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          repl: props.repl,
          author: props.user
        })
      }).then(r => r.json())
      .then(res => {
        if(res.success){
          location.href = "/dashboard"
        }else{
          alert(res.message || "Internal Error.  Check the browser console for details.");
          console.log(res.err)
        }
      })
    }
  }

  useEffect(() => {
    fetch("/api/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
      },
      body: JSON.stringify({
        author: props.user,
        repl: props.repl
      })
    }).then(r=>r.json()).then(res => console.log(res.success ? "View operation successful" : "Failed to apply View Operation"))
  }, [])
  
  return (<div>
    <Head>
      <title>{props.lost ? "Not Found" : `${props.repl} by ${props.user}`}</title>
    </Head>
    {props.lost && <Error />}
    {!props.lost && <DashNav>
      <div style={{ padding: '50px 40px' }}>
        <div className={styles.flexBody}>
            
          <div className={styles.replOptions}>
            <h3 style={{ padding: 0 }}>{props.repl}</h3>
      
            <div>
              <a href={`https://replit.com/@${props.user}/${props.repl}?embed=true`} target="_blank" rel="noreferrer"><button className={ui.uiButtonDark}>Fullscreen <ion-icon style={{ width: 15, height: 15, verticalAlign: 'middle', transform: 'translatey(-2px)' }} name="open-outline"></ion-icon></button></a>
              <a href={`https://replit.com/@${props.user}/${props.repl}`} target="_blank" rel="noreferrer"><button style={{ margin: '0 10px' }} className={ui.uiButtonDark}>Open in Replit <Replicon /></button></a>
              <button onClick={applyLike} className={ui.uiButton}>{likes} <ion-icon style={{ width: 15, height: 15, verticalAlign: 'middle', transform: 'translatey(-2px)' }} name="heart-outline"></ion-icon></button>
            </div>

            <div className={styles.userBox}>
              <Link href={"/user/" + author.username} passHref><div className={styles.flexUser}>
                <img src={author.icon.url} alt="User Avatar" className={styles.userAvatar}/>
                <span className={styles.userName}>{author.username}</span>
              </div></Link>
              <p className={styles.authorBio}>{author.bio}</p>
              <button onClick={followUser} className={(fd.filter(x => x.user+x.follow === props.me+props.user)[0] ? ui.uiButtonDark : ui.uiButton) + " " + ui.block + " " + styles.blockFollowBtn}>{fd.filter(x => x.user+x.follow === props.me+props.user)[0] ? "Unfollow" : "Follow"}</button>
            </div>

            {props.owner && <div className={ui.boxDimDefault} style={{margin: '10px 0'}}>
              <h4>Options</h4>
              <button onClick={updateRepl} className={ui.uiButton + " " + styles.blockFollowBtn} style={{display: 'flex', alignContent: 'center', alignItems: 'center'}}><span style={{flexGrow: 1}}>Reroll Repl</span> <span style={{display: load ? "block" : "none"}} className={styles.loader}></span></button>
              <button onClick={deleteRepl} className={ui.uiButtonDark + " " + styles.blockFollowBtn}>Delete Repl</button>
            </div>}







            {props.adminView && <div className={ui.boxDimDefault} style={{margin: '10px 0'}}>
              <h4>Admin Options</h4>
              <button onClick={removeRepl} className={ui.uiButtonDark + " " + styles.blockFollowBtn}>Remove Repl</button>
            </div>}






              
            <div className={styles.commentForm}>
              <h4 style={{marginBottom: 5}}>Write a Comment</h4>
              <textarea value={comment} onChange={e => updateComment(e.target.value)} className={ui.input + " " + styles.blockTA} rows="3" placeholder="..."></textarea>
              <button onClick={submitComment} className={ui.uiButton} style={{width: '100%', marginTop: 0}}>Post</button>
            </div>
          </div>
      
          <div className={styles.flexFrame}>
            <iframe style={{marginBottom: 10}} src={`https://replit.com/@${props.user}/${props.repl}?embed=true`} className={styles.replFrame}></iframe>
              {app.tags.map(x => <span key={x} className={styles.tag}>#{x}</span>)}
              <div style={{marginTop: 20}}>{app.desc}</div>
            <div className={styles.comments}>
              <h3 style={{paddingTop: 15, paddingBottom: 5, fontSize: '1.25em'}}>Comments ({comments.length})</h3>
              {comments.map(x => <Comment repl={props.repl} updateComments={updateComments} author={props.user} me={props.me} key={x.id} user={x.user} userAvatar={x.avatar} value={x.content} id={x.id}/>)}
            </div>
          </div>
        </div>

          

      </div>
    </DashNav>}
  </div>)
}

export async function getServerSideProps(ctx) {
  //if(ctx.req.headers["x-replit-user-name"] && ctx.req.cookies.sid){
  let app = await App.findOne({ user: ctx.params.user, repl: ctx.params.repl });
  let author = await fetch("https://" + ctx.req.headers.host + "/api/user/" + ctx.params.user).then(r => r.json());
  if (app) {
    return {
      props: {
        adminView: JSON.parse(process.env.ADMINS).includes(ctx.req.headers["x-replit-user-name"]),
        me: ctx.req.headers["x-replit-user-name"],
        owner: ctx.params.user === ctx.req.headers["x-replit-user-name"],
        user: ctx.params.user,
        repl: ctx.params.repl,
        app: JSON.stringify(app),
        author: JSON.stringify(author),
        lost: false,
        me: ctx.req.headers["x-replit-user-name"]
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