import nc from 'next-connect';
import { User } from '../../../scripts/mongo.js';
import {getData} from '../../../scripts/json.js'

const app = nc();

const headers = {
  'X-Requested-With':'replit',
  'Origin':'https://replit.com',
  'Accept':'application/json',
  'Referrer':'https://replit.com/jdog787',
  'Content-Type':'application/json',
  'Connection':'keep-alive',
  'Host': "replit.com",
  "x-requested-with": "XMLHttpRequest",
  "User-Agent": "Mozilla/5.0"
};

app.get(async (req, res) => {
  //GQL queries
  const posts = JSON.stringify({
    query: `{
      userByUsername(username: "${req.query.user}") {
        posts {
          items {
            title,
            id,
            voteCount
          }
        }
      }
    }`
  });
  const GQLuser = JSON.stringify({
    query: `{
      userByUsername(username: "${req.query.user}") {
        karma, 
        firstName, 
        lastName, 
        bio, 
        id, 
        image, 
        isHacker, 
        timeCreated,
        isBannedFromBoards,
        roles { name },
        languages(limit: 3) { displayName, icon }
      }
    }`
  });
  const repls = JSON.stringify({
    query: `{
      userByUsername(username: "${req.query.user}") {
        publicRepls(pinnedReplsFirst: true, showUnnamed: true, count: 1000) {
          items {
            title,
            language,
            language,
            lang {
              displayName,
              icon
            },
            config {
              isServer,
              gitRemoteUrl,
              domain,
              isVnc
            }
          }
        }
      }
    }`
  });

  let userPosts = await fetch('https://replit.com/graphql', {
		method: 'POST',
		headers,
		body: posts
	}).then(res => res.json())
  let postData = userPosts.data.userByUsername.posts.items;

  let userProfile = await fetch('https://replit.com/graphql', {
		method: 'POST',
		headers,
		body: GQLuser
	}).then(res => res.json())
  let userData = userProfile.data.userByUsername;

  let userRepls = await fetch('https://replit.com/graphql', {
		method: 'POST',
		headers,
		body: repls
	}).then(res => res.json())
  let replData = userRepls.data.userByUsername.publicRepls.items;
  
  let awards = await getData("awards.json", {})
  let user = req.query.user;
  //let userData = await fetch("https://" + req.headers.host + "/api/user/" + user).then(r => r.json());
  let userSch = await User.findOne({ name: user })
  if(user && userSch){
    let badges = [];
    //Replit ID age
    if(userData.id > 5000000){
      badges.push(["Modern Repler","modern"]);
    }
    else if(userData.id <= 5000000){
      badges.push(["Early Repler","early"]);
    }
    else if(userData.id <= 2500000){
      badges.push(["Olden Repler","olden"]);
    }
    else if(userData.id <= 1000000){
      badges.push(["Ancient Repler","ancient"]);
    }

    //Repl Count
    if(replData.length >= 200){
      badges.push(["Fused Repler", "r200"])
    }
    else if(replData.length >= 100){
      badges.push(["Devoted Repler", "r100"])
    }
    else if(replData.length >= 50){
      badges.push(["Dedicated Repler", "r50"])
    }
    else if(replData.length >= 25){
      badges.push(["Exceptional Repler", "r25"])
    }
    else if(replData.length >= 10){
      badges.push(["Average Repler", "r10"])
    }

    //Karma/Cycles
    if(userData.karma >= 10000){
      badges.push(["The Father", "cycle-father"])
    }
    else if(userData.karma >= 7500){
      badges.push(["Megastar", "cycle-megastar"])
    }
    else if(userData.karma >= 5000){
      badges.push(["Superstar","cycle-superstar"])
    }
    else if(userData.karma >= 2000){
      badges.push(["Legend", "cycle-legend"])
    }
    else if(userData.karma >= 1000){
      badges.push(["Celebrity","cycle-celebrity"])
    }
    else if(userData.karma >= 500){
      badges.push(["Respected","cycle-respected"])
    }
    else if(userData.karma >= 100){
      badges.push(["Rookie","cycle-rookie"])
    }

    //Posts
    if(postData.some(x => x.voteCount >= 2000)){
      badges.push(["The Legend Daddy","p2000"])
    }
    else if(postData.some(x => x.voteCount >= 1000)){
      badges.push(["One Hot Repl","p1000"])
    }
    else if(postData.some(x => x.voteCount >= 750)){
      badges.push(["Legendary Share","p750"])
    }
    else if(postData.some(x => x.voteCount >= 500)){
      badges.push(["Outstanding Share","p500"])
    }
    else if(postData.some(x => x.voteCount >= 250)){
      badges.push(["Amazing Share","p100"])
    }
    else if(postData.some(x => x.voteCount >= 100)){
      badges.push(["Awesome Share","p50"])
    }
    else if(postData.some(x => x.voteCount >= 50)){
      badges.push(["Cool Share","p25"])
    }
    else if(postData.some(x => x.voteCount >= 25)){
      badges.push(["Nice Share","p25"])
    }

    //Post Count
    if(postData.length >= 50){
      badges.push(["Community Dude","community-dude"])
    }
    else if(postData.length >= 20){
      badges.push(["Enthusuastic","enthusiastic"])
    }
    else if(postData.length >= 10){
      badges.push(["Active","active"])
    }
    else if(postData.length >= 5){
      badges.push(["Social","social"])
    }

    for(var i of userData.languages){
      badges.push([i["displayName"], i["icon"].includes("http")?i["icon"]:"https://replit.com" + i["icon"]])
    }

    //If the user is a replverse Administrator
    if(process.env.ADMINS.includes(user)){
      badges.push(["Replverse Admin","replverse-admin"])
    }

    //Hacker
    if(userData.isHacker){
      badges.push(["Hacker", "hacker"])
    }

    if(userData.roles.some(x => x.name === "explorer")){
      badges.push(["Explorer", "explorer"])
    }
    
    let findBadges = awards.filter(x => x.user === user)[0];
    if(findBadges){
      badges = [...badges, ...findBadges.badges]
    }
    
    
    res.json(badges)
  }else{
    res.status(404).json([]);
  }
})

export default app;