/* eslint-disable @next/next/no-img-element */
import styles from '../styles/components/dashnav.module.css'
import ui from '../styles/ui.module.css'
import Link from 'next/link';
import { useState, Component } from 'react';

export default class DashNav extends Component {
  constructor(props){
    super(props);
    this.state = {
      icon: "",
      visible: false,
      replname: "",
      showModal: false
    }
    this.toggle = this.toggle.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.publish = this.publish.bind(this);
    this.submitRepl = this.submitRepl.bind(this);
  }
  async componentDidMount(){
    const data = await fetch("/api/user/__me__").then(r => r.json())
    this.setState({
      icon: data.icon.url,
      username: data.username,
      visible: localStorage.getItem("nav") ? JSON.parse(localStorage.getItem("nav")) : true
    })
  }
  submitRepl(){
    alert("Submit Repl")
  }
  updateInput(e){
    this.setState({
      replname: e.target.value
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
      </div>}
      {this.state.visible && <div className={styles.navBody}>
          <div className={styles.navHeadFixed}>
          <div className={styles.menuBtn} onClick={() => this.toggle(false)}>
            <ion-icon name="menu-outline"></ion-icon>
          </div>
          <img src={this.state.icon} className={styles.avatar}/>
          <span className={styles.username}>@{this.state.username}</span>
          <div className={styles.notif}>
            <ion-icon name="notifications-outline"></ion-icon>                </div>
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
          <a href="/discord">Discord</a>
        </div>
        
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
          <div className={ui.formLabel} style={{marginTop: 15}}>Repl Title</div>
          <input className={ui.input + " " + styles.replName} value={this.state.replname} onChange={this.updateInput} style={{background: 'var(--background-higher)'}}/>
            <div className={styles.verifyFlex}>
              <img className={styles.replIcon} src="https://replit.com/public/images/languages/nodejs.svg"/>
              <div className={styles.replstatus}>
            <span style={{verticalAlign: 'middle', alignSelf: 'center'}}>{this.state.replname} is available</span>
              </div>
            </div>
          <button onClick={this.submitRepl} className={ui.uiButton} style={{width: '100%'}}>Publish</button>
        </div>
        </div>
      </div>
    );
  }
}

