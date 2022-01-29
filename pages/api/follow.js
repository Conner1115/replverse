import nc from 'next-connect';
import { App, User } from '../../scripts/mongo.js'
import { limiter, authUser, saveJSON, writeNotif } from '../../scripts/util.js'
import {getData} from '../../scripts/json.js'
const app = nc();

//add userAvatar field to json!!!!!!!

app.post(async (req, res) => {
  let fls = await getData("follows.json", {})
  authUser(req, res, async (usr) => {
    let follow = req.body.follow;
    let findUser = await User.findOne({user: follow});
    let userData = await fetch("https://" + req.headers.host + "/api/user/" + follow).then(r => r.json())
    let myData = await fetch("https://" + req.headers.host + "/api/user/" + usr.name).then(r => r.json())
    if(findUser){
     let findFollow = fls.filter(x => x.user+x.follow === usr.name+follow)[0];
      if(findFollow){
        fls = fls.filter(x => x.user+x.follow !== usr.name+follow);
        saveJSON("/data/follows.json", fls);
        res.json({
          success: true,
          message: "User unfollowed",
          data: fls
        })
      }else{
        fls.push({ user: usr.name, follow, avatar: userData.icon.url, userAvatar: myData.icon.url });
        saveJSON("/data/follows.json", fls);
        writeNotif({
          title: `${usr.name} followed you`,
          link: "#",
          cont: "You now have " + fls.filter(x => x.follow === follow).length + " followers",
          icon: myData.icon.url,
          userFor: follow
        })
        res.json({
          success: true,
          message: "Congrats!  You now follow " + follow + "!",
          data: fls
        })
      }
    }else{
      res.status(404).json({
        success: false,
        message: "User not found",
        err: "The user you were trying to follow no longer exists."
      })
    }
    
  });
})

export default app;