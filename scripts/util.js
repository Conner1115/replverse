import md5 from 'md5'
import requestIp from 'request-ip'
import rateLimit from 'express-rate-limit'
import { User } from './mongo.js'
import fs from 'fs'
import notifs from '../data/notifs.json';

//['IroncladDev', 'amasad', 'replitfaris', 'cnnd', 'TheDrone7', '21natzil', 'connorbrewster', 'Bookie0', 'Coder100', 'CoolCoderSJ', 'Nayoar', 'Dart', 'frissyn', 'CodingCactus', 'SixBeeps', 'LenaAtReplit', 'JDOG787', 'lilykhan', 'AllAwesome497', 'masfrost', 'JDOG787']



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

//title, link, cont, icon, userFor, r
function writeNotif(stats){
  let ntfs = [...notifs, {
    title: stats.title,
    link: stats.link,
    cont: stats.cont,
    icon: stats.icon,
    userFor: stats.userFor,
    r: false
  }];
  if(!stats.title)throw new Error("'title' field is Required")
  if(!stats.link)throw new Error("'link' field is Required")
  if(!stats.cont)throw new Error("'cont' field is Required")
  if(!stats.icon)throw new Error("'icon' field is Required")
  if(!stats.userFor)throw new Error("'userFor' field is Required")
  while(ntfs.length > 5000){
    ntfs.shift();
  }
  saveJSON("/data/notifs.json", ntfs);
}


export { md5, admins, limiter, authUser, saveJSON, writeNotif }