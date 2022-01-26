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
    if(JSON.parse(process.env.ADMINS).includes(req.body.user)){
      res.status(403).json({
        success: false,
        message: "You can't disable another administrator!",
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
          title: `Moderator Strike`,
          link: `javascript:alert('${message || "Your account has been disabled for breaking the rules."}')`,
          cont: message || "Your account has been disabled for breaking the rules.",
          icon: adminData.icon.url,
          userFor: findUser.name
        });
        fetch("https://replverse-api.ironcladdev.repl.co/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "* /*"
          },
          body: JSON.stringify({
            auth: process.env.ADMSS,
            to: findUser.email,
            subject: "Replverse Moderator Strike",
            body: `Hello, ${user}, your replverse account has been disabled indefinitely.  This means we've removed all your published repls on the site, all your followers, and made your account completely non-functional.<br><br>${message || "“We have disabled your replverse account.”"}`
          })
        })
        .then(r => r.json()).then(sent => {
          if(sent.success){
            App.remove({ user }, (e, d) => {
              let filtered = rcs.filter(x => x.user !== user);
              saveJSON("/data/records.json", filtered);
              let snd = fls.filter(x => x.follow === user);
              let __blackList = [...blacklist, {
                token: md5(findUser.token)
              }];
              saveJSON("/data/blacklist.json", __blackList)
              for(var i = 0; i < snd.length; i++){
                let u = snd[i].user;
                writeNotif({
                  title: `${user} has been Disabled`,
                  link: `javascript:alert('${user}, one of the users you follow, has unfortunately been disabled and prevented from using the site indefinitely.');`,
                  cont: message || `${user}, one of the users you follow, has unfortunately been disabled and prevented from using the site indefinitely.`,
                  icon: adminData.icon.url,
                  userFor: u
                });
              }
              let flt = fls.filter(x => x.follow !== user);
              saveJSON("/data/follows.json", fls)
              res.json({ success: true });
            });
          }else{
            res.json({ success: false, message: sent.message })
          }
        })
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