/* eslint-disable @next/next/no-img-element */
import DashNav from '../../../components/dashnav.js';
import Nav from '../../../components/nav.js';
import Head from 'next/head';
import { App } from '../../../scripts/mongo.js'
import Error from '../../../components/404.js';
import styles from '../../../styles/pages/spotlight.module.css'
import ui from '../../../styles/ui.module.css'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {getData} from '../../../scripts/json.js';
import {Negative, Positive, Swal, showClass, hideClass} from '../../../scripts/modal';

function Comment(props){
  const deleteComment = () => {
     Swal.fire({
      showClass, hideClass,
       showConfirmButton: false,
       showDenyButton: true,
      denyButtonText: '<ion-icon name="trash-outline"></ion-icon> Delete Comment',
      title: "Delete Comment?",
      text: "Are you sure you would like to delete this comment?",
      showCancelButton: true,
      preDeny: async () => {
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
            Negative.fire({ title: res.message || "Internal Error" })
            console.log(res.err)
        }
      })
    }})
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
  const [fd, updateF] = useState(props.follows)
  const [comment, updateComment] = useState("");
  const app = JSON.parse(props.app);
  const [comments, updateComments] = useState(app.comments);
  const [likes, updateLikes] = useState(app.likes);
  const [load, toggleLoad] = useState(false);
  const author = JSON.parse(props.author);
  const reportRepl = () => {
     Swal.fire({
       showCloseButton: true,
      allowOutsideClick: false,
      showClass, hideClass,
      title: "Report Repl?",
      text: "Are you sure you would like to remove this repl?",
      showCancelButton: true,
      showDenyButton: true,
       showConfirmButton: false,
      denyButtonText: '<ion-icon name="flag-outline"></ion-icon> Yes, report repl',
      preDeny: async () => {
        
        const { value: reason } = await Swal.fire({
          showCloseButton: true,
      allowOutsideClick: false,
          title: 'Provide Reason',
          text: "Please provide a reason of why this breaks the rules and why you are reporting it.",
          input: 'text',
          showClass, hideClass,
          inputPlaceholder: "Reason (10 words or less)",
          showCancelButton: true,
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Reason is required'
            }
          }
        })
        if(reason){
        fetch("/api/report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "*/*"
          },
          body: JSON.stringify({
            repl: props.repl,
            author: props.user,
            reason: reason
          })
        }).then(r => r.json())
        .then(res => {
          if(res.success){
            Positive.fire("Reported");
          }else{
              Negative.fire({ title: res.message || "Internal Error" })
              console.log(res.err)
          }
        })
        }
      }})
  }
  const applyLike = () => {
    const cookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift();
    if(+cookie("newuser") === 2){
      Swal.fire({
        confirmButtonText: "Next",
        allowEscapeKey: false,
        allowEnterKey: false,
        allowOutsideClick: false,
        title: "Upvote Applied",
        html: "Nice!  You've just added a like to your repl.<br><br>Let's take a look at the chat next.",
        preConfirm: () => {
          document.cookie="newuser=3; path=/; Max-Age="+1000 * 60 * 60 * 24 * 365 * 10
          location.href = "/chat"
        }
      })
    }
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
          Negative.fire({ title: res.message || "Internal Error" })
          console.log(res.err)
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
        Negative.fire({ title: res.message || "Internal Error" })
        console.log(res.error);
      }
    })
  }
  const submitComment = () => {
    if(comment.length > 3){
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
        Negative.fire({ title: res.message || "Internal Error" })
        console.log(res.err)
      }
    })
    }else{
      Negative.fire("Comment must be at least three characters")
    }
  }
  const removeRepl = (props.adminView) ? () => {
    Swal.fire({
      showCloseButton: true,
      allowOutsideClick: false,
      showClass, hideClass,
      title: "Remove Repl?",
      text: "Are you sure you would like to remove this repl?",
      showCancelButton: true,
      showConfirmButton: false,
      showDenyButton: true,
      denyButtonText: '<ion-icon name="trash-outline"></ion-icon> Yes, Remove Repl',
      preDeny: async () => {

        const { value: warning } = await Swal.fire({
          showCloseButton: true,
      allowOutsideClick: false,
          title: 'Provide Reason',
          text: "Please provide a reason of why this breaks the rules and why you are removing it.",
          input: 'text',
          showClass, hideClass,
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
            Negative.fire({ title: res.message || "Internal Error" })
            console.log(res.error);
          }
        })
      }
      }
    })
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
        Negative.fire({ title: res.message || "Internal Error" })
        console.log(res.err)
        toggleLoad(false);
      }
    })
    }catch(e){
      Negative.fire("Failed to reroll repl");
      toggleLoad(false);
    }
  }
  const deleteRepl = async () => {
    Swal.fire({
      showCloseButton: true,
      allowOutsideClick: false,
      showClass, hideClass,
      title: "Delete Repl?",
      text: "Are you really absolutely 100% sure you would like to delete this repl?  This cannot be undone.",
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: false,
      denyButtonText: '<ion-icon name="trash-outline"></ion-icon> Yes, Delete my repl',
      preDeny: () => {
        fetch("/api/deleterepl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "* /*"
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
            Negative.fire(res.message || "Internal Error");
            console.log(res.err)
          }
        })
      }})
  }
  const onboard = () => {
    Swal.fire({
      confirmButtonText: "Next",
      allowEscapeKey: false,
      allowEnterKey: false,
      allowOutsideClick: false,
      title: "One step closer!",
      html: "Congrats!  You've just published your first repl!  As you can see, there are a whole bunch of things you can play with in these spotlight pages.<br><br>You can do anything from reporting a project to commenting and upvoting it as well.<br><br>Try upvoting your repl with the like button."
    })
  }

  useEffect(() => {
    const cookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift();
    if(+cookie("newuser") === 2){
      onboard();
    }
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
    }).then(r => r.json()).then(console.log)
  }, [])
  
  return (<div>
    <Head>
      <title>{props.lost ? "Not Found" : `${props.repl} by ${props.user}`}</title>
    </Head>
    {props.lost && <Error />}
    {!props.lost && <DashNav close={!props.me}>
      {!props.me && <Nav/>}
      <div style={{ padding: '50px 40px' }}>
        <div className={styles.flexBody}>
            
          <div className={styles.replOptions} style={{display: props.me ? 'block' : 'none'}}>
            <h3 style={{ padding: 0 }}>{props.repl}</h3>
      
            <div>
              <a href={`https://replit.com/@${props.user}/${props.repl}?embed=true`} target="_blank" rel="noreferrer"><button className={ui.uiButtonDark}>Fullscreen <ion-icon style={{ width: 15, height: 15, verticalAlign: 'middle', transform: 'translatey(-2px)' }} name="open-outline"></ion-icon></button></a>
              <a href={`https://replit.com/@${props.user}/${props.repl}`} target="_blank" rel="noreferrer"><button style={{ margin: '0 10px' }} className={ui.uiButtonDark}>Open in Replit</button></a>
              <button onClick={applyLike} className={ui.uiButton}>{likes} <ion-icon style={{ width: 15, height: 15, verticalAlign: 'middle', transform: 'translatey(-2px)' }} name="heart-outline"></ion-icon></button>
              <div>
                <button onClick={reportRepl} className={ui.uiButtonDark + " " + styles.blockFollowBtn} style={{marginTop: 0}}>Report</button>
              </div>
            </div>
            

            <div className={styles.userBox}>
              <Link href={"/user/" + author.username} passHref><div className={styles.flexUser}>
                <img src={author.icon.url} alt="User Avatar" className={styles.userAvatar}/>
                <span className={styles.userName}>{author.username}</span>
              </div></Link>
              <p className={styles.authorBio}>{author.bio}</p>
              {!props.owner && <button onClick={followUser} className={(fd.filter(x => x.user+x.follow === props.me+props.user)[0] ? ui.uiButtonDark : ui.uiButton) + " " + ui.block + " " + styles.blockFollowBtn}>{fd.filter(x => x.user+x.follow === props.me+props.user)[0] ? "Unfollow" : "Follow"}</button>}
            </div>

            {props.owner && <div className={ui.boxDimDefault} style={{margin: '10px 0'}}>
              <h4>Options</h4>
              <button onClick={updateRepl} className={ui.uiButton + " " + styles.blockFollowBtn} style={{display: 'flex', alignContent: 'center', alignItems: 'center'}}><span style={{flexGrow: 1}}>Reroll Repl</span> <span style={{display: load ? "block" : "none"}} className={styles.loader}></span></button>
              <button onClick={deleteRepl} className={ui.uiButtonDanger + " " + styles.blockFollowBtn}>Delete Repl</button>
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
        follows: await getData("follows.json", { follow: ctx.params.user }) || [],
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