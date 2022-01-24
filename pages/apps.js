import DashNav from '../components/dashnav'
import styles from '../styles/pages/apps.module.css'
import Repl from '../components/repl'
import ui from '../styles/ui.module.css'
import Head from 'next/head'
import { useState, useEffect } from 'react';
export default function Apps(props){
  let [pick, setPick] = useState(0);
  let [search, setSearch] = useState("")
  let [topic, setTopic] = useState("")
  let [tags, setTags] = useState([])
  let [tag, setTag] = useState("")
  let [displayRepls, setDisplay] = useState(4);
  useEffect(() => {
    window.addEventListener("load", () => {
      setDisplay(4);
      if(window.innerWidth <= 1450){
        setDisplay(3);
      }
      if(window.innerWidth <= 1150){
        setDisplay(2);
      }
      if(window.innerWidth <= 800){
        setDisplay(1);
      }
    })
    window.addEventListener("resize", () => {
      setDisplay(4);
      if(window.innerWidth <= 1450){
        setDisplay(3);
      }
      if(window.innerWidth <= 1150){
        setDisplay(2);
      }
      if(window.innerWidth <= 800){
        setDisplay(1);
      }
    })
  }, [])
  useEffect(() => {
      setDisplay(4);
      if(window.innerWidth <= 1450){
        setDisplay(3);
      }
      if(window.innerWidth <= 1150){
        setDisplay(2);
      }
      if(window.innerWidth <= 800){
        setDisplay(1);
      }
  })
  return (<div>
    <Head>
        <title>Explore | Replverse</title>
    </Head>
    <DashNav>
    <div className={styles.bodyCont}>
      <h2 className={styles.staffHeader}>Staff Picks</h2>
      <div className={styles.staffPickContainer}>

        <div className={styles.buttonLeft} onClick={() => {
          setPick(pick-1 <= 0 ? 0 : pick-1)

      }}>
          <svg preserveAspectRatio="xMidYMin" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="transparent" style={{verticalAlign: "middle", transform: 'rotate(90deg)'}}><path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </div>
  
        <div className={styles.staffPickRow}>
          {props.picks.slice(pick,pick+displayRepls).map(r => <Repl key={Math.random()} username={r.creator} avatar={r.avatar} comments={r.comments} slug={r.slug} likes={r.likes} cover={r.cover} title={r.title} tags={r.tags}/>)}
        </div>
  
        <div className={styles.buttonRight} onClick={() => {
          setPick(pick+(displayRepls) >= props.picks.length ? props.picks.length - (displayRepls) : pick+1)
        }}>
          <svg preserveAspectRatio="xMidYMin" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="transparent" style={{verticalAlign: "middle", transform: 'rotate(-90deg)'}}><path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </div>
      </div>

      <div className={styles.searchEngine}>
      <span className={styles.flexIntrude}>
        <input type="text" autoComplete="off" placeholder="search" className={ui.input + " " + styles.searchInput} onChange={(e) => setSearch(e.target.value)} value={search} style={{alignSelf: 'flex', height: '100%'}}/>
        <select className={ui.uiButtonDark + " " + styles.selectTopic} onChange={(e) => setTopic(e.target.value)} value={topic} style={{alignSelf: 'stretch', height: '100%',margin: '0 10px'}}>
          <option value="hot">Hot</option>
          <option value="new">New</option>
          <option value="top">Top</option>
        </select>
      </span>
  
        <div className={styles.tagWrapper}>
          <div className={styles.tags}>
            {tags.map(x => <div onClick={() => {setTags(tags.filter(y => y !== x))}} className={styles.tag} key={x}>{x}</div>)} 
          </div>
          <input placeholder="Add Tags" maxLength={25} className={styles.tagInput} onKeyUp={(e) => {
            if((e.key === 'Enter' || e.key === ',') && tag.length > 0 && tags.length < 5){
              setTags([...new Set([...tags, tag])]);
              setTag("");
            }
          }} onChange={(e) => {
              setTag(e.target.value.replace(/\s/g,"-").replace(/[^a-z0-9\-]/g,""))
          }} value={tag}/>
        </div>
    
      </div>
  
      <div className={styles.appsCore}>
          {props.repls.map(r => <Repl key={Math.random()} username={r.creator} avatar={r.avatar} comments={r.comments} slug={r.slug} likes={r.likes} cover={r.cover} title={r.title} tags={r.tags}/>)}
      </div>
    </div>
  </DashNav>
  </div>)
}
export async function getServerSideProps({req, res}){
  return {
    props: {
      repls: new Array(30).fill({
        creator: "Username",
        avatar: "/user.svg",
        comments: Math.floor(Math.random() * 500),
        likes: Math.floor(Math.random() * 500),
        cover: "/graphics/image.svg",
        title: "Repl Title " + Math.floor(Math.random() * 500),
        tags: ["javascript", "console", "game", "apps", "fun"],
        slug: "testslug"
      }),
      picks: [{
        creator: "Username",
        avatar: "/user.svg",
        comments: Math.floor(Math.random() * 500),
        likes: Math.floor(Math.random() * 500),
        cover: "/graphics/image.svg",
        title: "Repl Title " + Math.floor(Math.random() * 500),
        tags: ["javascript", "console", "game", "apps", "fun"],
        slug: "testslug"
      },{
        creator: "Username",
        avatar: "/user.svg",
        comments: Math.floor(Math.random() * 500),
        likes: Math.floor(Math.random() * 500),
        cover: "/graphics/image.svg",
        title: "Repl Title " + Math.floor(Math.random() * 500),
        tags: ["javascript", "console", "game", "apps", "fun"],
        slug: "testslug"
      },{
        creator: "Username",
        avatar: "/user.svg",
        comments: Math.floor(Math.random() * 500),
        likes: Math.floor(Math.random() * 500),
        cover: "/graphics/image.svg",
        title: "Repl Title " + Math.floor(Math.random() * 500),
        tags: ["javascript", "console", "game", "apps", "fun"],
        slug: "testslug"
      },{
        creator: "Username",
        avatar: "/user.svg",
        comments: Math.floor(Math.random() * 500),
        likes: Math.floor(Math.random() * 500),
        cover: "/graphics/image.svg",
        title: "Repl Title " + Math.floor(Math.random() * 500),
        tags: ["javascript", "console", "game", "apps", "fun"],
        slug: "testslug"
      },{
        creator: "Username",
        avatar: "/user.svg",
        comments: Math.floor(Math.random() * 500),
        likes: Math.floor(Math.random() * 500),
        cover: "/graphics/image.svg",
        title: "Repl Title " + Math.floor(Math.random() * 500),
        tags: ["javascript", "console", "game", "apps", "fun"],
        slug: "testslug"
      }]
    }
  }
}