/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useRef } from 'react'
import Head from 'next/head';
import ui from '../styles/ui.module.css';
import io from 'socket.io-client'
import styles from '../styles/pages/chat.module.css'
import DashNav from '../components/dashnav'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify';
import { parse, marked } from 'marked';
import { getData } from '../scripts/json.js';
import { User } from '../scripts/mongo.js';
import hljs from 'highlight.js/lib/common';
import {Negative, Swal, showClass, hideClass, Positive} from '../scripts/modal'
import EmojiConvertor from 'emoji-js'

var emoji = new EmojiConvertor();

let socket = false;

let channels = {
  "Main Talk": "HEADER",
  "general": "General replverse chat.  Please keep things clean.",
  "oof-topic": "Off-topic chat.  Likewise, keep things sfw.",
  "help": "Live help chat",
  "replverse-feedback": "Have any feedback on replverse?  Post it here!",
  "feedback-discussion": "Discuss new features and share your newest ideas for replverse here",
  "replverse-bot": "Use Replverse Bot in here!",
  "Programming": "HEADER",
  "programmming": "Programming in general.",
  "web-dev": "Web-development related stuff goes here.",
  "game-dev": "Game Development related stuff goes here.",
  "bot-dev": "Discord bot conversations and such goes here.",
  "ai-and-ml": "AI and Machine Learning.",
  "misc-programming": "Miscalleneous programming discussion.",
  "Languages": "HEADER",
  "python": "Talk about python here",
  "javascript": "Talk about javascript here",
  "ruby": "Talk about ruby here",
  "html-css": "Talk about html/css here",
  "rust": "Talk about rust here",
  "ruby": "Talk about ruby here",
  "golang": "Talk about golang here",
  "swift": "Talk about swift here",
  "other-langs": "Talk about other langs here",
}

function getToday() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day;
}

function parseDay(d) {
  var date = new Date(d * 24 * 60 * 60 * 1000);
  var options = { month: 'short', day: 'numeric' };
  return (date.toLocaleString('us', options))
}

function Channel(props){
  return (<div className={styles.channel + " " + (props.channel === props.name && styles.channelSelected)} onClick={() => props.onClick(props.name)}>#{props.name}{props.messageCount > 0 ? ` (${props.messageCount})` : ""}</div>)
}

function UserRow(props){
  return (<Link href={"/user/" + props.name} passHref><div className={styles.userRow}>
    <img src={props.avatar} alt={props.name + "'s avatar"}/><span>{props.name}</span>  
  </div></Link>);
}

const ScrollView = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView(/*{ behavior: "smooth" }*/));
  return <div ref={elementRef} />;
};

//stackoverflow!!
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default function Chat(props){
  const [channel, changeChannel] = useState(props.channel);
  const [online, setOnline] = useState([]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(props.messages || []);
  const [autoCom, setAutoCom] = useState([]);
  const inputRef = useRef();
  const users = JSON.parse(props.users).map(x => x.name);
  const [modal, togModal] = useState(true);
  const [slide, slideScreen] = useState(1) //channes, chat, online
  const [compact, setCompact] = useState(false);
  const [messageIndex, setMI] = useState(-30);

  const playNotif = () => {
    let audio = new Audio("/notif.mp3")
    audio.play()
    setTimeout(function(){
      audio.remove();
    }, 2)
  }
  const playOnline = () => {
    let audio = new Audio("/online.mp3")
    audio.play()
    setTimeout(function(){
      audio.remove();
    }, 2)
  }
  const completeUser = (user) => {
    return users.filter(x => new RegExp(user, "ig").test(x));
  }
  const handleInput = (e) => {
    let enterKey = e.code === "Enter";
    let shiftKey = e.shiftKey;
    if(enterKey){
      e.preventDefault();
      if(shiftKey){
        setInput(input.slice(0, inputRef.current.selectionStart) + "\n" + input.slice(inputRef.current.selectionStart, input.length))
        enterKey = false;
        shiftKey = false;
      }else{
        if(autoCom.length > 0){
          let inputVal = input.split(/[\s\n]/);
          let sliceBefore = inputVal.slice(0, inputVal.length-1);
          setInput([...sliceBefore, `\u200b@${autoCom[0]}\u200b `].join` `)
          setAutoCom([]);
        }else{
          emitChat();
          enterKey = false;
          shiftKey = false;
        }
      }
    }
  }
  const emitChat = () => {
    let bodyCont = JSON.stringify({data: {
        username: props.replitName,
        text: input.replace(/\\n/g, "\\n")
                                      .replace(/\\'/g, "\\'")
                                      .replace(/\\"/g, '\\"')
                                      .replace(/\\&/g, "\\&")
                                      .replace(/\\r/g, "\\r")
                                      .replace(/\\t/g, "\\t")
                                      .replace(/\\b/g, "\\b")
                                      .replace(/\\f/g, "\\f"),
        avatar: props.avatar,
        channel: channel,
        id: Math.random().toString(36).slice(2),
        day: getToday()
      }, pings: detectPing(input)})
    fetch("/api/message/send", {
      method: "POST",
      body: bodyCont,
      headers: {
        "Content-Type": "application/json",
        accept: "*/*"
      }
    }).then(r => r.json()).then(data => {
      if(!data.success){
        Negative.fire(data.message)
      }
    })
    setInput("");
    const cookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift();
    if(+cookie("newuser") === 3){
      Swal.fire({
        confirmButtonText: "Next",
        allowEscapeKey: false,
        allowEnterKey: false,
        allowOutsideClick: false,
        title: "Message Sent!",
        html: "Nice!  You just sent your first message!  Is anyone else online?  Howabout mentioning them with an @ in front of their name?  What happens when you mention yourself?<br><br>Send a new message in the #oof-topic channel and then delete it.",
        preConfirm: () => {
          document.cookie="newuser=4; path=/; Max-Age="+1000 * 60 * 60 * 24 * 365 * 10
        }
      })
    }
  }
  const updateInput = (e) => {
    let val = e.target.value;
    let splitVal = val.split(/[\s\n]/);
    let word = splitVal.slice(-1)[0];
    if(word[0] === "@"){
      let name = word.slice(1, word.length);
      setAutoCom(completeUser(name).sort((a,b) => a.localeCompare(b)).slice(0, 10));
    }else{
      setAutoCom([])
    }
    setInput(val);
  }
  const deleteMessage = (id) => {
    Swal.fire({
      showClass, hideClass,
      title: "Delete Message",
      text: "Are you sure you would like to delete your message?",
      showCancelButton: true,
      showDenyButton: true,
       showConfirmButton: false,
      denyButtonText: '<ion-icon name="trash-outline"></ion-icon> Yes, delete message',
      preDeny: async () => {
      fetch("/api/message/delete", {
        method: "POST",
        body: JSON.stringify({
          id
        }),
        headers: {
          "Content-Type": "application/json",
          accept: "*/*"
        }
      }).then(r => r.json()).then(data => {
        if(!data.success){
          Negative.fire(data.message)
        }
        const cookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift();
    if(+cookie("newuser") === 4){
      Swal.fire({
        confirmButtonText: "Next",
        allowEscapeKey: false,
        allowEnterKey: false,
        allowOutsideClick: false,
        title: "Message Deleted!",
        html: "Now it looks like you have a good feel of the chat system!  Before you start chatting your days away, let's check out the community hotlist.",
        preConfirm: () => {
          document.cookie="newuser=5; path=/; Max-Age="+1000 * 60 * 60 * 24 * 365 * 10
          location.href="/apps"
        }
      })
    }
      })
    }
    })
  };
  const detectPing = (txt) => {
    let splt = txt.split(/[\s\n]/);
    let foundPings = [];
    for(var i = 0; i < splt.length; i++){
      let word = splt[i];
      if(/\u200b\@.+\u200b/.test(word)){
        foundPings.push(word.replace(/[^0-9a-z]/ig,""));
      }
    }
    return foundPings;
  };

  let send = false;
  const sendNotif = (title, text, icon) => {
    if(!send){
      if (!("Notification" in window)) {
        console.warn("Your Browser does not support Chrome Notifications :(")
      }else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        let notif = new Notification(title, {
          icon: icon,
          body: text
        });
        setTimeout(() => notif.close(), 3000);
      }else if (Notification.permission !== 'denied') {
        Notification.requestPermission((perm) => {
          if (!('permission' in Notification)) {
            Notification.permission = perm;
          }
          if (perm === "granted") {
            let notif = new Notification(title, {
              icon: icon,
              body: text
            });
            setTimeout(() => notif.close(), 3000);
          }
        });
      }else {
        console.warn(`Failed, Notification Permission is ${Notification.permission}`);
      }
      send = true;
      setTimeout(() => send = false, 100);
    }
    playNotif();
  }

  useEffect(() => {
    const cookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift();
    if(+cookie("newuser") === 3){
      Swal.fire({
        confirmButtonText: "Next",
        allowEscapeKey: false,
        allowEnterKey: false,
        allowOutsideClick: false,
        title: "Communications",
        html: "In the replverse chat, you can communicate with others, ask for help in realtime, and even ping/mention each other.<br><br>Let's start by reading the rules.  Please read them carefully!"
      })
    }
    if(window.innerWidth < 600){
      setCompact(true);
    }
    window.addEventListener("resize", () => {
      if(window.innerWidth < 600){
        setCompact(true);
      }else{
        setCompact(false)
      }
    })
    marked.setOptions({
      langPrefix: 'language-',
      highlight: function(code, lang) {
        return hljs.highlight(lang, code).value;
      }
    });
    hljs.highlightAll();
    if(JSON.parse(localStorage.getItem("chatrulesmodal-replverse"))){
      togModal(false);
      
    }
    if(socket === false){
      socket = io("https://replverse-data.ironcladdev.repl.co", {
        extraHeaders: {
          username: props.replitName
        }
      });
    }
      socket.emit("join", {
        username: props.replitName,
        avatar: props.avatar
      })
      socket.on("online", __online => {
            if(!arraysEqual(online, __online)){
              const cookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift();
        if(+cookie("newuser") !== 3){
              Positive.fire(__online.slice(-1)[0].username + " Joined the Chat");
              playOnline();
        }
            }
        
        setOnline([{ username: "(:) Replverse Bot", avatar: "/logo.svg" },...__online])
      })
      socket.on("chat", (msg) => {
        if(msg.last){
          if(detectPing(msg.last.text).includes(props.replitName)){
            sendNotif(msg.last.username + " Mentioned you in #" + msg.last.channel, msg.last.text, "/logo.png")
          }
        }
        setMessages(msg.data)
      })
    
  }, [])

  let inputRows = (input.match(/\n/g) ? input.match(/\n/g).length : 1) + 1;

  const setSlide = (num) => {
    if(window.innerWidth < 600){
      let n = slide + num;
      if(n < 0){
        n = 2;
      }
      if(n > 2){
        n = 0;
      }
      slideScreen(n);
    }else{
      slideScreen(1);
    }
  }
  
  return (<div>
    <Head>
      <title>Chat | Replverse</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.4.0/styles/base16/oceanicnext.css"/>
    </Head>
    <DashNav page="chat">
      <div className={styles.bodyCont}>
        {compact && <div className={styles.openChannels} onClick={() => setSlide(-1)}><span>&lt;</span></div>}
        {compact && <div className={styles.openOnline} onClick={() => setSlide(1)}><span>&gt;</span></div>}
        <div className={styles.channelList}  style={{
          display: compact ? (slide === 0 ? 'block' : 'none') : 'block'
        }}>
          <div className={styles.channelContainer}>
            {Object.keys(channels).map(x => channels[x] === "HEADER" ? <h4 key={x}>{x}</h4> :<Channel channel={channel} key={x} name={x} onClick={(c) => {
              changeChannel(c);
              setSlide(1);
            }} messageCount={messages.filter(y=>y.channel===x).length}/>)}
          </div>
        </div>
        <div className={styles.chatCore} style={{
          display: compact ? (slide === 1 ? 'flex' : 'none') : 'flex'
        }}>
          <div className={styles.headerBar}>
            <strong>#{channel}</strong>{" - "}{channels[channel]}
          </div>
          <div className={styles.messageFlexer}>
          <div className={styles.messageBody} style={{paddingBottom: 20}}>
            <h2 style={{paddingTop: 20}}>Welcome to #{channel}</h2>
            <p style={{margin: 0, marginBottom: 20}}>{channels[channel]}</p>
            <hr/>
              {messages.filter(x => x.channel === channel).slice(messageIndex, messageIndex + 29).length >= 29 && <a onClick={() => {
                if(messages.filter(x => x.channel === channel).slice(messageIndex, messageIndex + 29).length >= 29){
                  setMI(messageIndex - 30);
                }
              }} style={{marginBottom: 10, textAlign: 'center', display: 'block', padding: '10px 0'}}>Show More</a>}


            {[...messages.filter(x => x.channel === channel),false].slice(messageIndex, messageIndex + 29).map(x => {
              if(x){
              let san = DOMPurify.sanitize(marked(x.text.replace(/\</g, "&lt;").replace(/\>/g, "&gt;")));
              return (x.compact ? (<div style={{
                  background: detectPing(x.text).includes(props.replitName) ? "var(--accent-primary-dimmest)" : "var(--background-root)",
                paddingTop: 0
              }} className={styles.message} id={x.id} key={Math.random()}>
                        <div style={{
                          display: 'flex',
              width: '100%'
                        }}>
              <div className={styles.mdMessage} style={{flexGrow: 1, paddingLeft: 40}} dangerouslySetInnerHTML={{__html: emoji.replace_colons(san)}}></div>
                        {(x.username === props.replitName || props.admin) && <div className={styles.mDel} onClick={() => deleteMessage(x.id)}><ion-icon name="trash"></ion-icon></div>}
                        </div>
                      </div>) : (<div style={{
                boxShadow: detectPing(x.text).includes(props.replitName) ? "0 10px 0 0 var(--accent-primary-dimmest), inset 0 10px 0 0 var(--background-root)" : '0 0 0 0 transparent',
                  background: detectPing(x.text).includes(props.replitName) ? "var(--accent-primary-dimmest)" : "var(--background-root)"
              }} className={styles.message} id={x.id} key={Math.random()}>
                        <a href={"/user/" + x.username} target="_blank" rel="noreferrer"><img alt={x.username + "'s avatar"} className={styles.messageAvatar} src={x.avatar}/></a>
                        <div className={styles.mBody}>
                        <div className={styles.mNick}>{x.username}{'day' in x && <span className={styles.dateStamp}>{parseDay(x.day)}</span>} {(x.username === props.replitName || props.admin) && <span className={styles.mDel} onClick={() => deleteMessage(x.id)}><ion-icon name="trash"></ion-icon></span>}</div>
                        <div className={styles.mdMessage} dangerouslySetInnerHTML={{__html: emoji.replace_colons(san)}}></div>
                        </div>
                      </div>))
}
            })}


              {messageIndex < -30 && <a onClick={() => {
                  setMI(-30);
              }} style={{marginBottom: 10, textAlign: 'center', display: 'block', padding: '10px 0'}}>Jump to present</a>}
              <ScrollView/>
          </div>
              </div>

          <div className={styles.sendForm}>
            <textarea ref={inputRef} maxLength={500} placeholder={"Message #" + channel} className={ui.input + " " + styles.input} onChange={updateInput} onKeyDown={handleInput} rows={inputRows < 2 ? 2 : (inputRows < 10 ? inputRows : 10)} value={input}/>
            <button className={ui.actionButton} onClick={emitChat}>Send</button>
          </div>
          <div className={styles.userFind} style={{ display: autoCom.length > 0 ? "block" : "none" }}>
            {autoCom.map(x => <div onClick={() => {
              let inputVal = input.split(/[\s\n]/);
              let sliceBefore = inputVal.slice(0, inputVal.length-1);
              setInput([...sliceBefore, `@${x}`].join` `)
              setAutoCom([]);
            }} className={styles.userRes} key={x}>{x}</div>)}
          </div>
        </div>
        <div className={styles.memberList}  style={{
          display: compact ? (slide === 2 ? 'block' : 'none') : 'block'
        }}>
          <h4>Online - {online.length}</h4>
          {online.map(x => <UserRow key={Math.random()} name={x.username} avatar={x.avatar}/>)}
        </div>
      </div>
      <div className={styles.chatRulesModal} style={{display: modal ? "block" : "none"}}>
        <h3 style={{paddingTop: 0, textAlign: 'center '}}>Replverse Chat Rules</h3>
              <p><strong>Important - Please read these rules before you connect with your fellow replers.</strong></p>
              <p><strong>1. Be nice</strong> - Please talk in a positive manner and refrain from being rude, cursing, and talking to others in a negative way.</p>
              <p><strong>2. No Botting</strong> - I&apos;m saying it right here for you.  Botting is not allowed whatsoever.  Whether using your own account, an alternate replit account, or tampering with websockets within the browser console, the same rules apply.  If you want, you may fork this project and make bots for your own fork.</p>
              <p>That&apos;s it for the rules.  Please abide by them.  Just because something isn&apos;t stated here, does&apos;t mean you don&apos;t have to follow it.  Violating the rules can result in a whole bunch of nasty outcomes. 
 Read the <Link href="/rules">Official Community Rules</Link> for more info.  Thank you for joining and using replverse.  Enjoy.</p>
              <button className={ui.uiButton} style={{width: 200, position: 'relative', left: '50%', transform: 'translatex(-50%)'}} onClick={() => {
              localStorage.setItem("chatrulesmodal-replverse", true)
              togModal(false)
            const cookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift();
    if(+cookie("newuser") === 3){
      Swal.fire({
        confirmButtonText: "Next",
        allowEscapeKey: false,
        allowEnterKey: false,
        allowOutsideClick: false,
        title: "Nice!",
        html: "Now that you've ready the rules, let's send our first message.  Write a new one in #general and if anyone's online, be sure to ping them >:)"
      })
    }
              }}>Close</button>
      </div>
    </DashNav>
  </div>)
}

export async function getServerSideProps({req, res, query}){
  if(req.headers["x-replit-user-name"]){
    let userData = await fetch("https://" + req.headers.host + "/api/user/" + req.headers["x-replit-user-name"]).then(r => r.json());
    let messages = await getData("messages.json", {});
    let users = await User.find({}, "name");
    return {
      props: {
        avatar: userData.icon.url,
        replitName: req.headers["x-replit-user-name"],
        messages,
        users: JSON.stringify([...new Set(users)]),
        admin: JSON.parse(process.env.ADMINS).includes(req.headers["x-replit-user-name"]),
        channel: query.channel || "general"
      }
    }
  }else{
    return {
      redirect: {
        destination: "/signup"
      }
    }
  }
}