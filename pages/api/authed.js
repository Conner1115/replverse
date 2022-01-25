import nc from 'next-connect';
import { User } from '../../scripts/mongo.js';
import md5 from 'md5';
import requestIp from 'request-ip';
import { serialize } from 'cookie';

const app = nc();
app.post(async (req, res) => {
  let u = await User.findOne({ name: req.headers["x-replit-user-name"] });
  if(u){
    if(u.verified){
      u.addr = md5(requestIp.getClientIp(req));
      u.save();
      res.setHeader('Set-Cookie', `sid=${u.token}; path=/; Max-Age=${1000 * 60 * 60 * 24 * 365 * 10}`);
      res.json({ success: true });
    }else{
      res.json({ success: false, message: "Please verify your email before you log in." })
    }
  }else{
    res.json({ success: false, message: "User does not exist" })
  }
})

export default app;