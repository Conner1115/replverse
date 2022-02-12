/* eslint-disable @next/next/no-img-element */
import DashNav from '../components/dashnav.js'
import styles from '../styles/pages/badges.module.css'
import Head from 'next/head'

function Badge(props){
  return (<div>
        <h4>{props.name}</h4>
        <div style={{fontWeight: 300, fontSize: 18, marginTop: 10}}>{props.desc}</div>
        <img alt={props.name} src={"/badges/" + props.slug + ".svg"}/>
      </div>);
}

export default function Badges(props){
  return (<div>
    <Head>
        <title>Badges | Replverse</title>
      </Head>
    <DashNav page="badges">
      <h3 style={{width: '90%', margin: 'auto', maxWidth: '1000px'}}>Badges</h3>
      <div className={styles.badgeGrid}>
  
      <Badge name="Ancient Repler" desc="Be in the first million replit users" slug="ancient"/>
      <Badge name="Olden Repler" desc="Be in the first 2.5 million replit users" slug="olden"/>
      <Badge name="Early Repler" desc="Be in the first 5 million replit users" slug="early"/>
      <Badge name="Modern Repler" desc="You joined replit after the 5-millionth user" slug="modern"/>

      <Badge name="Rookie" desc="Get 100 cycles on your replit account" slug="cycle-rookie"/>
      <Badge name="Respected" desc="Get 500 cycles on your replit account" slug="cycle-respected"/>
      <Badge name="Celebrity" desc="Get 1K cycles on your replit account" slug="cycle-celebrity"/>
      <Badge name="Legend" desc="Get 2K cycles on your replit account" slug="cycle-legend"/>
      <Badge name="Superstar" desc="Get 5K cycles on your replit account" slug="cycle-superstar"/>
      <Badge name="Megastar" desc="Get 7.5K cycles on your replit account" slug="cycle-megastar"/>
      <Badge name="The Father" desc="Get 10K cycles on your replit account" slug="cycle-father"/>

      <Badge name="Average Repler" desc="Have 10 repls on your replit account" slug="r10"/>
      <Badge name="Exceptional Repler" desc="Have 25 repls on your replit account" slug="r25"/>
      <Badge name="Dedicated Repler" desc="Have 50 repls on your replit account" slug="r50"/>
      <Badge name="Devoted Repler" desc="Have 100 repls on your replit account" slug="r100"/>
      <Badge name="Fused Repler" desc="Have 200 repls on your replit account" slug="r200"/>


      <Badge name="Nice Share" desc="Get 25 upvotes on a shared repl/post" slug="p25"/>
      <Badge name="Cool Share" desc="Get 50 upvotes on a shared repl/post" slug="p50"/>
      <Badge name="Awesome Share" desc="Get 100 upvotes on a shared repl/post" slug="p100"/>
      <Badge name="Amazing Share" desc="Get 250 upvotes on a shared repl/post" slug="p250"/>
      <Badge name="Outstanding Share" desc="Get 500 upvotes on a shared repl/post" slug="p500"/>
      <Badge name="Legendary Share" desc="Get 750 upvotes on a shared repl/post" slug="p750"/>
      <Badge name="One Hot Repl" desc="Get 1000 upvotes on a shared repl/post" slug="p1000"/>
      <Badge name="The Legend Daddy" desc="Get 2000 upvotes on a shared repl/post" slug="p2000"/>
    <Badge name="Social" desc="Post five things on repl talk/community" slug="social"/>
    <Badge name="Active" desc="Post ten things on repl talk/community" slug="active"/>
    <Badge name="Enthusiastic" desc="Post twenty things on repl talk/community" slug="enthusiastic"/>
    <Badge name="Community Dude" desc="Post fifty things on repl talk/community" slug="community-dude"/>

    <Badge name="Hacker" desc="Be subscribed to replit's hacker plan" slug="hacker"/>
  <Badge name="Replit Team" desc="Be an employee or intern of replit" slug="replit-team"/>
  <Badge name="Loyal Repler" desc="Be a loyal repler in the replit discord." slug="loyal-repler"/>
  <Badge name="Replverse Admin" desc="Be an administrator of Replverse" slug="replverse-admin"/>
      </div>
    </DashNav>
  </div>)
}