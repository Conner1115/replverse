import nc from 'next-connect'
import md5 from 'md5'
import superagent from 'superagent'
import { User } from '../../scripts/mongo.js'
import requestIp from 'request-ip'
import { v4 as uuidv4 } from 'uuid';

const app = nc();

app.post(async (req, res) => {
  let findUserByName = await User.findOne({
    name: req.headers["x-replit-user-name"]
  });
  let findUserByIp = await User.findOne({
    addr: md5(requestIp.getClientIp(req))
  });
  
  if(findUserByName){
    res.json({ success: false, message: "A user with that name already exists.  Howabout logging in?" });
  }else if(findUserByIp){
    res.json({ success: false, message: "Account creation is limited to one per device / IP." });
  }else{
    
    let __data = await fetch("https://" + req.headers.host + "/api/user/" + req.headers["x-replit-user-name"])
    let data = await __data.json()
    let hashedEmail = md5(req.body.email);
      
      let usr = new User({
        token: uuidv4(),
        name: req.headers["x-replit-user-name"],
        email: req.body.email,
        addr: md5(requestIp.getClientIp(req))
      })
      
      fetch("https://replverse-api.ironcladdev.repl.co/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "* /*"
        },
        body: JSON.stringify({
          auth: process.env.ADMSS,
          to: req.body.email,
          subject: "Verify your Email Address",
          body: `Hello, ${req.headers["x-replit-user-name"]}!  Before you can start using Replverse, please <a href="https://${req.headers.host}/api/verify/${usr.token}">verify your email address</a>.`
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
  }
})

export default app;