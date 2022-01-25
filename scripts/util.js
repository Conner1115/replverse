import md5 from 'md5'
import requestIp from 'request-ip'
import rateLimit from 'express-rate-limit'
import { User } from './mongo.js'
import fs from 'fs'

const admins = JSON.parse((process.env.ADMINS).replace(/\'/g, '"'))

const limiter = (time, max, handler) => {
  return rateLimit({
    windowMs: time,
    max: max,
    handler: handler || function (req, res, /*next*/) {
      return res.status(429).json({
        success: false,
        message: 'Too many attempts.  Please try again later.'
      })
    },
    keyGenerator: function (req, res) {
      return requestIp.getClientIp(req);
    }
  })
};

async function authUser(req, res, callback){
  let __user = await User.findOne({ token: req.cookies.sid, name: req.headers["x-replit-user-name"] });
  if(__user){
    callback(__user);
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized Attempt",
      err: "Unauthorized Attempt"
    })
  }
}

function saveJSON(path, json){
  fs.writeFile(process.cwd() + path, JSON.stringify(json), (err) => {
    if (err) throw err;
  });
}


export { md5, admins, limiter, authUser, saveJSON }