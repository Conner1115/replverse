import nc from 'next-connect';
import { User } from '../../../scripts/mongo.js';
import awards from '../../../data/awards.json';

const app = nc();

app.get(async (req, res) => {
  let user = req.query.user;
  let userData = await fetch("https://" + req.headers.host + "/api/user/" + user).then(r => r.json());
  let userSch = await User.findOne({ name: user })
  if(user && userSch){
    let badges = [];
    
    if(userData.id <= 1000000){
      badges.push(["Ancient Repler","ancient"]);
    }
    
    if(userData.karma >= 100){
      badges.push(["Rookie","cycle-rookie"])
    }
    if(userData.karma >= 500){
      badges.push(["Respected","cycle-respected"])
    }
    if(userData.karma >= 1000){
      badges.push(["Celebrity","cycle-celebrity"])
    }
    if(userData.karma >= 2000){
      badges.push(["Legend", "cycle-legend"])
    }
    if(userData.karma >= 5000){
      badges.push(["Superstar","cycle-superstar"])
    }
    if(userData.karma >= 7500){
      badges.push(["Megastar", "cycle-megastar"])
    }
    if(userData.karma >= 10000){
      badges.push(["The Father", "cycle-father"])
    }
    if(process.env.ADMINS.includes(user)){
      badges.push(["Replverse Admin","replverse-admin"])
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