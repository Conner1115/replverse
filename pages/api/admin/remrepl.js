import nc from 'next-connect';
import superagent from 'superagent'
import { User, App } from '../../../scripts/mongo.js'
import { limiter, authUser, writeNotif } from '../../../scripts/util.js'

const app = nc();

app.post(async (req, res) => {
  authUser(req, res, async (usr) => {
    if(JSON.parse(process.env.ADMINS).includes(req.body.user) && !JSON.parse(process.env.SUPERIOR_ADMINS).includes(req.headers["x-replit-user-name"])){
      res.status(403).json({
        success: false,
        message: "You can't hide another admin's repl",
        err: ""
      })
    }else{
      if(process.env.ADMINS.includes(usr.name)){
        let user = req.body.user;
        let message = req.body.message;
        let findUser = await User.findOne({ name: user });
        let adminData = await fetch("https://" + req.headers.host + "/api/user/" + usr.name).then(r => r.json());
        let __repl = await App.findOne({ repl: req.body.repl });
        if(__repl){
          writeNotif({
            title: `Your repl has been removed`,
            link: `javascript:alert('Your repl ${req.body.repl} has been removed due to this reason: ${message}');`,
            cont: message ? `Your repl ${req.body.repl} has been removed by a moderator due to this reason: ${message}` : `Your repl ${req.body.repl} has been removed by a moderator`,
            icon: adminData.icon.url,
            userFor: findUser.name
          });
          __repl.remove();
          res.json({
            success: true
          })
        }else{
          res.status(404).json({
            success: false,
            message: "Repl does not exist"
          })
        }
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