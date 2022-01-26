import nc from 'next-connect';
import superagent from 'superagent'
import { User, App } from '../../../scripts/mongo.js'
import { limiter, authUser, writeNotif, saveJSON } from '../../../scripts/util.js'
import records from '../../../data/records.json'
import follows from '../../../data/follows.json'
let rcs = [...records];
let fls = [...follows]


const app = nc();

app.post(async (req, res) => {
  authUser(req, res, async (usr) => {
    if(JSON.parse(process.env.ADMINS).includes(req.body.user) && !JSON.parse(process.env.SUPERIOR_ADMINS).includes(req.headers["x-replit-user-name"])){
      res.status(403).json({
        success: false,
        message: "You can't purge another administrator!",
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
          title: `Your Account has been Wiped`,
          link: `javascript:alert('${message || "Your repls and followers have been removed from your replverse account.  Please follow the rules."}')`,
          cont: message || "Your repls and followers have been removed from your replverse account.  Please follow the rules.",
          icon: adminData.icon.url,
          userFor: findUser.name
        });
            App.remove({ user }, (e, d) => {
              let filtered = rcs.filter(x => x.user !== user);
              saveJSON("/data/records.json", filtered);
              let snd = fls.filter(x => x.follow === user);
              for(var i = 0; i < snd.length; i++){
                let u = snd[i].user;
                writeNotif({
                  title: `${user} has been Purged`,
                  link: `javascript:alert('${user}, one of the users you follow has broken the rules and their account has been wiped completely.  You have been removed from their list of followers.');`,
                  cont: message || `${user}, one of the users you follow has broken the rules and their account has been wiped completely.  You have been removed from their list of followers.`,
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