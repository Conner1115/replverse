import nc from 'next-connect';
import superagent from 'superagent'
import { User, App } from '../../../scripts/mongo.js'
import { limiter, authUser, writeNotif, saveJSON } from '../../../scripts/util.js'
import records from '../../../data/records.json'
import follows from '../../../data/follows.json'
import blacklist from '../../../data/blacklist.json'
import md5 from 'md5';
let rcs = [...records];
let fls = [...follows];


const app = nc();

app.post(async (req, res) => {
  authUser(req, res, async (usr) => {
    if(JSON.parse(process.env.ADMINS).includes(req.body.user) && !JSON.parse(process.env.SUPERIOR_ADMINS).includes(req.headers["x-replit-user-name"])){
      res.status(403).json({
        success: false,
        message: "You can't ban another administrator!",
        err: ""
      })
    }else{
      if(JSON.parse(process.env.ADMINS).includes(usr.name)){
        let user = req.body.user;
        let message = req.body.message;
        let findUser = await User.findOne({ name: user });
        let adminData = await fetch("https://" + req.headers.host + "/api/user/" + usr.name).then(r => r.json());
        let email = findUser.email;
        writeNotif({
          title: `You have been IP banned`,
          link: `javascript:alert('${message || "Your account has been disabled for breaking the rules."}')`,
          cont: message || "Your account has been disabled for breaking the rules.",
          icon: adminData.icon.url,
          userFor: findUser.name
        });
            App.remove({ user }, (e, d) => {
              let filtered = rcs.filter(x => x.user !== user);
              saveJSON("/data/records.json", filtered);
              let snd = fls.filter(x => x.follow === user);
              let __blackList = [...blacklist, {
                banKey: md5(findUser.addr)
              }];
              saveJSON("/data/blacklist.json", __blackList)
              for(var i = 0; i < snd.length; i++){
                let u = snd[i].user;
                writeNotif({
                  title: `${user} has been banned`,
                  link: `javascript:alert('${user}, one of the users you follow, has unfortunately been banned and prevented from using the site indefinitely.');`,
                  cont: message || `${user}, one of the users you follow, has unfortunately been banned and prevented from using the site indefinitely.`,
                  icon: adminData.icon.url,
                  userFor: u
                });
              }
              let flt = fls.filter(x => x.follow !== user);
              saveJSON("/data/follows.json", fls)
              res.json({ success: true });
            });
          
        
      }else{
        res.json({
          success: false,
          message: "Unauthorized Attempt",
          err: ""
        })
      }
    }
  })
})

export default app;