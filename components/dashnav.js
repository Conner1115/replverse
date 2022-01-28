/* eslint-disable @next/next/no-img-element */
import styles from '../styles/components/dashnav.module.css'
import ui from '../styles/ui.module.css'
import Link from 'next/link';
import { useState, Component, useRef } from 'react';
//import __ntfs from '../data/notifs.json'
//let notifs = [...__ntfs]

import { getNotifs, getUnreadsCount } from '../scripts/json.js';

function TagInput(props){
  let inputRef = useRef(null);
  return (<div className={styles.tagWrapper} ref={inputRef}>
          <div className={styles.tags}>
            {props.tags.map(x => <div onClick={() => {props.setTags(props.tags.filter(y => y !== x))}} className={styles.tag} key={x}>{x}</div>)} 
          </div>
          <input placeholder={props.tags.length < 5 ? "Add Tags" : "Max Tags Added"} minLength={3} maxLength={25} className={styles.tagInput} onKeyUp={(e) => {
            if((e.key === 'Enter' || e.key === ',') && props.tag.length > 0 && props.tags.length < 5){
              props.setTags([...new Set([...props.tags, props.tag])]);
              props.setTag("");
            }
              setTimeout(() => {
                 inputRef.current.scrollTo(5000, 0)
              }, 2)
          }} onChange={(e) => {
              inputRef.current.scrollTo(5000, 0)
              props.setTag(e.target.value.replace(/\s/g,"-").replace(/[^a-z0-9\-]/g,""))
          }} value={props.tags.length < 5 ? props.tag : ""}/>
        </div>);
}

//title, link, cont, icon, userFor, r

export default class DashNav extends Component {
  constructor(props){
    super(props);
    this.state = {
      icon: "",
      visible: false,
      replname: "",
      showModal: false,
      replstatus: 2,
      langicon: "/blank.svg",
      loading: false,
      tag: "",
      tags: [],
      notifModal: false,
      notifs: []
    }
    this.toggle = this.toggle.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.publish = this.publish.bind(this);
    this.submitRepl = this.submitRepl.bind(this);
    this.setTags = this.setTags.bind(this);
    this.setTag = this.setTag.bind(this);
    this.toggleNotifModal = this.toggleNotifModal.bind(this);
    this.readNotifs = this.readNotifs.bind(this);
  }
  readNotifs(){
    fetch("/api/readnotifs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
      },
      body: ""
    }).then(r => r.json()).then(res => {
      if(res.success){
        this.setState({
          notifs: res.data
        })
      }else{
        alert(res.message || "Internal Error.  Read the browser console for more information.");
        console.log(res.err);
      }
    })
  }
  toggleNotifModal(v){
    this.setState({
      notifModal: v
    })
  }
  setTags(v){
    this.setState({
      tags: v
    })
  }
  setTag(v){
    this.setState({
      tag: v
    })
  }
  async componentDidMount(){
    const data = await fetch("/api/user/__me__").then(r => r.json())
    if(data){
      this.setState({
        icon: data.icon.url,
        username: data.username,
        visible: localStorage.getItem("nav") ? JSON.parse(localStorage.getItem("nav")) : true,
        notifs: getNotifs(data.username),
        unreads: getUnreadsCount(data.username)
      })
      console.log(getNotifs(data.username));
      console.log(getUnreadsCount(data.username))
    } else {
      this.setState({
        icon: "/user.svg",
        username: "Guest",
        visible: true
      })
    }
  }
  async submitRepl(){
    this.setState({
      loading: true
    })
    if(this.state.replstatus === 0){
      let ft = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "* /*"
        },
        body: JSON.stringify({
          repl: this.state.replname,
          tags: this.state.tags
        })
      })
        let res = await ft.json()
        if(ft.status !== 200){
          this.setState({
            loading: false,
          })
          alert("Please make sure your repl is running so replverse can get a screenshot.")
        }
        if(res.success){
          this.setState({
            loading: false
          })
          location.href = "/repl/" + res.user + "/" + res.slug
        } else {
          alert(res.message || "Internal Server Error.  Check browser console for details.")
          console.log(res.err)
          this.setState({
            loading: false
          })
        }     
    }else{
      this.setState({
        loading: false
      })
    }
  }
  updateInput(e){
    this.setState({
      replname: e.target.value
    });
    fetch("/api/findrepl?q=" + e.target.value)
      .then(r => r.json())
      .then(res => {
        this.setState({
          replstatus: res.status,
          langicon: res.lang || "/blank.svg",
          replmessage: res.message
        })
      })
  }
  toggle(b){
    localStorage.setItem("nav", b);
    this.setState({
      visible: b
    })
  }
  publish(){
    this.setState({
      showModal: true
    })
  }
  
  render(){
    return (
      <div className={styles.nav}>
      {!this.state.visible && <div onClick={() => {this.toggle(true)}} className={styles.navButtonVis}>
        <ion-icon name="menu-outline"></ion-icon>
        {this.state.unreads > 0 && <span className={styles.menuNotif}></span>}
      </div>}
      {this.state.visible && <div className={styles.navBody}>
          <div className={styles.navHeadFixed}>
          <div className={styles.menuBtn} onClick={() => this.toggle(false)}>
            <ion-icon name="menu-outline"></ion-icon>
          </div>
          <img alt="User Avatar" src={this.state.icon} className={styles.avatar}/>
          <span className={styles.username}>@{this.state.username}</span>
          <div className={styles.notifBtn} onClick={() => this.toggleNotifModal(!this.state.notifModal)}>
            <ion-icon name="notifications-outline"></ion-icon>  {this.state.unreads > 0 && <span className={styles.notifMarker}>{this.state.unreads}</span> }               
          </div>
        </div>

          <button onClick={this.publish} style={{marginBottom: 5}} className={ui.uiButtonMed + " " + ui.blockEl}>
          <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="transparent" style={{verticalAlign: 'middle', transform: 'translatey(-2px)'}}><path d="M12 4V20M4 12H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
    {'  '}Share a Repl</button>

        <Link href="/dashboard" passHref>
          <button className={styles.navLink} style={{marginTop: `0 !important`}}>
            <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="transparent"><path d="M9 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H15M9 22V13.5H15V22M9 22H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            {" "}Home</button>
        </Link>

        <Link href="/apps" passHref>
          <button className={styles.navLink}>
              <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="transparent" ><path d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H2M12 22C6.47715 22 2 17.5228 2 12M12 22C14.5013 19.2616 15.9228 15.708 16 12C15.9228 8.29203 14.5013 4.73835 12 2M12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2M2 12C2 6.47715 6.47715 2 12 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            {" "}Browse</button>
        </Link>

        <Link href="/rules" passHref>
          <button className={styles.navLink}>
            <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="transparent" ><path d="M12 7C12 5.93913 11.5786 4.92172 10.8284 4.17157C10.0783 3.42143 9.06087 3 8 3H2V18H9C9.79565 18 10.5587 18.3161 11.1213 18.8787C11.6839 19.4413 12 20.2044 12 21M12 7V21M12 7C12 5.93913 12.4214 4.92172 13.1716 4.17157C13.9217 3.42143 14.9391 3 16 3H22V18H15C14.2044 18 13.4413 18.3161 12.8787 18.8787C12.3161 19.4413 12 20.2044 12 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            {" "}Rules</button>
        </Link>

        <a href="https://digest.repl.co" target="_blank" rel="noreferrer">
          <button className={styles.navLink}>
              <svg preserveAspectRatio="xMidYMin" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="transparent" ><path d="M12 7.99987C9 5.99997 5 7.49992 5 11.4999C5 14.9999 6.5 20.4999 10 20.4999C10.6802 20.4999 11.3545 20.3031 12 19.9814C12.6455 20.3031 13.3198 20.4999 14 20.4999C17.5 20.4999 19 14.9999 19 11.4999C19 7.49992 15 5.99997 12 7.99987ZM12 7.99987C12 5.19987 13.6667 3.83331 14.5 3.49998M6.98243 2.12827C8.21605 2.05993 9.47244 2.49696 10.4148 3.43936C11.3572 4.38175 11.7943 5.63814 11.7259 6.87177C10.4923 6.9401 9.23592 6.50307 8.29352 5.56068C7.35112 4.61828 6.91409 3.36189 6.98243 2.12827Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            {" "}Learn</button>
        </a>

        <div className={styles.navFoot}>
        </div>
        
        </div>}

        {(this.state.visible && this.state.notifModal) && <div className={styles.notifModal + " " + ui.boxDimDefault}>
          <div>
            <button className={ui.uiButtonDark} onClick={this.readNotifs} style={{display: 'block', width: 'calc(100% - 20px)', margin: '10px'}}>Mark as Read</button>
          </div>
          <div className={styles.notifsBody}>
            {this.state.notifs.length === 0 && <div style={{textAlign: 'center', color: 'var(--foreground-dimmer)', fontStyle: 'italic'}}>No notifications yet</div>}
            {this.state.notifs
            .map(x => <Link key={Math.random()} href={x.link} passHref><div className={styles.notif + " " + (!x.r && styles.unread)}>
              <div className={styles.notifTop}>
                  <img alt="Notification Icon" src={x.icon} className={styles.notifIcon}/>
                  <span className={styles.notifHeader}>{x.title}</span>
              </div>
              <div className={styles.notifContent}>{x.cont}</div>
            </div></Link>)}</div>
        </div>}
        
        <div className={styles.mainBody} style={{width: this.state.visible ? "calc(100vw - 240px)" : '100vw', left: this.state.visible ? 240 : 0}}>{this.props.children}</div>

        <div style={{display: this.state.showModal ? "block" : "none"}}>
        <div className={styles.blockCurtain} onClick={() => {
            this.setState({
              showModal: false
            })
        }}></div>
        <div className={styles.publishModal + " " + ui.boxDimDefault}>
          <h3 style={{padding: 0, fontSize: '1.5em', textAlign: 'center'}}>Share a Repl</h3>
          <div className={ui.formLabel} style={{marginTop: 15}}>Repl Title (Case-Sensitive!)</div>
          <input className={ui.input + " " + styles.replName} value={this.state.replname} onChange={this.updateInput} style={{background: 'var(--background-higher)'}}/>
            <div className={styles.verifyFlex}>
              <img alt="Language Icon" className={styles.replIcon} src={this.state.langicon}/>
              <div className={styles.replstatus} style={{
                background: this.state.replstatus === 0 ? `var(--accent-positive-dimmest)` : (this.state.replstatus === 1 ? `var(--accent-negative-dimmest)` : `var(--background-root)`)
              }}>
            <span style={{verticalAlign: 'middle', alignSelf: 'center'}}>{this.state.replmessage}</span>
            <div className={styles.replLoader} style={{display: this.state.loading ? "block" : "none"}}></div>
              </div>
            </div>

            <TagInput tag={this.state.tag} tags={this.state.tags} setTag={this.setTag} setTags={this.setTags}/>
          
          <button onClick={this.submitRepl} className={ui.uiButton} style={{width: '100%'}}>Publish</button>
        </div>
        </div>
      </div>
    );
  }
}