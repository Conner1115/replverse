import nc from 'next-connect'
import md5 from 'md5'
import superagent from 'superagent'
import { User } from '../../scripts/mongo.js'
import requestIp from 'request-ip'
import { v4 as uuidv4 } from 'uuid';
import blacklist from '../../data/blacklist.json'

const app = nc();

app.post(async (req, res) => {
  let findBanned = blacklist.filter(x => x.addr === md5(requestIp.getClientIp(req)))[0];
  if(findBanned){
    res.status(403).json({
      success: false,
      message: "You were banned from using the site indefinitely.  Unfortunately, we've stopped you from signing up with an alternate account."
    })
  }else{
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
          addr: md5(requestIp.getClientIp(req))
        })
        usr.save();
        res.setHeader('Set-Cookie', `sid=${usr.token}; path=/; Max-Age=${1000 * 60 * 60 * 24 * 365 * 10}`);
        res.json({
          success: true
        })
    }
  }
})

export default app;