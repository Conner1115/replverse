import nc from 'next-connect'
import md5 from 'md5'
import { User, App } from '../../scripts/mongo.js'
import requestIp from 'request-ip'
import { authUser, saveJSON } from '../../scripts/util.js'
import {getData} from '../../scripts/json.js'

const app = nc();

app.post(async (req, res) => {
  let records = await getData("records.json", {})
  let notifs = await getData("follows.json", {})
  let follows = await getData("follows.json", {})
  if(req.body.question === "DELETE_MY_REPLVERSE_ACCOUNT"){
  authUser(req, res, async (usr) => {
    let findUser = await User.findOne({ name: usr.name });
    if(findUser.name === usr.name === req.headers["x-replit-user-name"]){
      let apps = await App.find({ user: findUser.name }, "_id");
      let recs = records.filter(x => (x.user !== findUser.name && x.author !== findUser.name));
      let ntfs = notifs.filter(x => x.userFor !== findUser.name);
      let flls = follows.filter(x => x.user !== findUser.name && x.follow !== findUser.name)
      saveJSON("/data/notifs.json", ntfs)
      saveJSON("/data/follows.json", flls)
      saveJSON("/data/records.json", recs)
      for(var i of apps){
        let a = await App.findOne({ _id: i });
        a.remove();
      }
      res.setHeader('Set-Cookie', `sid=0; path=/; Max-Age=${1}`);
      findUser.remove();
      res.json({
        success: true
      });
    }else{
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        err: "Unauthorized"
      })
    }
  })
  }else{
    res.json({
      success: false,
      message: "Incorrect answer",
      err: "Enter Prompted Answer"
    })
  }
})

export default app;