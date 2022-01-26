import nc from 'next-connect';
import superagent from 'superagent'
import { User } from '../../../scripts/mongo.js'
import { limiter, authUser, writeNotif } from '../../../scripts/util.js'

const app = nc();

app.post(async (req, res) => {
  authUser(req, res, async (usr) => {
    if(JSON.parse(process.env.ADMINS).includes(req.body.user) && !JSON.parse(process.env.SUPERIOR_ADMINS).includes(req.headers["x-replit-user-name"])){
      res.status(403).json({
        success: false,
        message: "You can't warn another administrator!",
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
          title: `Moderator Warning`,
          link: `/repl/${req.body.author}/${req.body.repl}`,
          cont: message || "Please follow the rules.",
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
            subject: "Replverse Moderator Warning",
            body: `Hello, ${user}, you have been given a warning by a moderator.<br><br>${message}`
          })
        })
        .then(r => r.json()).then(sent => {
          if(sent.success){
            res.json({ success: true })
            usr.save();
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