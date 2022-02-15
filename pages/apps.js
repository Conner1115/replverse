import DashNav from '../components/dashnav'
import styles from '../styles/pages/apps.module.css'
import Repl from '../components/repl'
import ui from '../styles/ui.module.css'
import Head from 'next/head'
import { useState, useEffect } from 'react';
import {Swal} from '../scripts/modal'
export default function Apps(props){
  let [pick, setPick] = useState(0);
  let [search, setSearch] = useState("")
  let [topic, setTopic] = useState("hot")
  let [tags, setTags] = useState([])
  let [tag, setTag] = useState("")
  let [repls, setRepls] = useState([]);
  useEffect(() => {
      const cookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift();
      if(+cookie("newuser") === 5){
        Swal.fire({
          confirmButtonText: "Finish",
          title: "Community Hotlist",
          html: "Take a look at all these amazing repls out here!  This is the last major feature of replverse.<br><br>If you've liked replverse and would like to know the latest updates on replverse, be sure to join my <a href='https://discord.gg/TZCc8P2cyH'>discord server</a> and click the like button at <a href='https://replit.com/@IroncladDev/replverse'>https://replit.com/@IroncladDev/replverse</a>.<br><br>Thanks for joining and using replverse!  Enjoy!",
          preConfirm: () => {
            document.cookie="newuser=; path=/; Max-Age=" + 1
          }
        })
      }
  }, [])

  const setData = (config) => {
    let datastr = `/api/apps?filter=${config.topic || topic}&tags=${JSON.stringify(config.tags ?? tags)}&search=${config.search ?? search}`;
    console.log(datastr)
    fetch(datastr).then(r => r.json()).then(setRepls)
  }

  useEffect(() => {
    setData({})
  }, [])
  
  return (<div>
    <Head>
        <title>Explore | Replverse</title>
    </Head>
    <DashNav page="apps">
    <div className={styles.bodyCont}>
      <div className={styles.searchEngine}>
      <span className={styles.flexIntrude}>
        <input type="text" autoComplete="off" placeholder="Enter to search" className={ui.input + " " + styles.searchInput} onKeyUp={(e) => {
  if(e.keyCode === 13)setData({ search: e.target.value });
}} onChange={(e) => setSearch(e.target.value)} value={search} style={{alignSelf: 'flex', height: '100%'}}/>
        <select className={ui.uiButtonDark + " " + styles.selectTopic} onChange=  {(e) => {
  setTopic(e.target.value);
  setData({
    topic: e.target.value
  });
}} value={topic} style={{alignSelf: 'stretch', height: '100%',margin: '0 10px'}}>
          <option value="hot">Hot</option>
          <option value="new">New</option>
          <option value="top">Top</option>
          <option value="old">Old</option>
        </select>
      </span>
  
        <div className={styles.tagWrapper}>
          <div className={styles.tags}>
            {tags.map(x => <div onClick={() => {
              setTags(tags.filter(y => y !== x));
              setData({
                tags: tags.filter(y => y !== x)
              })
            }} className={styles.tag} key={x}>{x}</div>)} 
          </div>
          <input placeholder="Add Tags" maxLength={25} className={styles.tagInput} onKeyUp={(e) => {
            if((e.key === 'Enter' || e.key === ',') && tag.length > 0 && tags.length < 5){
              setTags([...new Set([...tags, tag])]);
              setTag("");
              setData({
                tags: [...new Set([...tags, tag])]
              })
            }
          }} onChange={(e) => {
              setTag(e.target.value.replace(/\s/g,"-").replace(/[^a-z0-9\-]/g,""))
          }} value={tag}/>
        </div>
    
      </div>
  
      <div className={styles.appsCore}>
          {repls.map(r => <Repl key={Math.random()} username={r.user} avatar={r.avatar} comments={r.comments.length} desc={r.desc||""} slug={r.slug} likes={r.likes} cover={r.cover} title={r.repl} tags={r.tags} views={r.views}/>)}
      </div>
    </div>
  </DashNav>
  </div>)
}
export async function getServerSideProps({req, res}){
  return {
    props: {
      picks: [{
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