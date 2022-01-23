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
    
    let __data = await superagent.get("https://replit.com/data/profiles/" + req.headers["x-replit-user-name"])
    let data = JSON.parse(__data.text);
    let hashedEmail = md5(req.body.email);
    if(data.emailHash === hashedEmail){
      
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
          body: `Hello, ${req.headers["x-replit-user-name"]}!  Before you can start using Replverse, please <a href="https://replverse.ironcladdev.repl.co/api/verify/${usr.token}">verify your email address</a>.`
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
      res.json({ success: false, message: "Email does not match replit account" })
    }
  }
})

export default app;