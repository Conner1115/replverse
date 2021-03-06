import md5 from 'md5'
import requestIp from 'request-ip'
import rateLimit from 'express-rate-limit'
import { User, App } from './mongo.js'
import {getData} from './json.js'

const admins = JSON.parse((process.env.ADMINS).replace(/\'/g, '"'))
const isAdmin = (username) => {
  return admins.includes(username);
}

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
  if(req.headers["x-replit-user-name"] && req.cookies.sid){
    let blacklist = await getData("blacklist.json", {})
    let __user = await User.findOne({ token: req.cookies.sid, name: req.headers["x-replit-user-name"] });
    let userExists = await User.findOne({ name: req.headers["x-replit-user-name"] });
    let banned = blacklist.filter(x => x.token === md5(__user.token))[0];
    let banned2 = [...blacklist].filter(x => x.banKey === md5(__user.addr))[0];
    if(banned || banned2){
      res.status(403).json({
        success: false,
        message: "Your account has been disabled.  You are no longer permitted to perform any actions on the site.",
        err: "Your account has been disabled.  You are no longer permitted to perform any actions on the site."
      })
    }else{
      if(__user){
        callback(__user);
      } else {
        res.status(401).json({
          success: false,
          message: userExists ? "Unauthorized Attempt" : "It seems as though your account doesn't exist.  Please clear your cookies and go to https://" + req.headers.host + "/signup and re-register.  Sorry about that.",
          err: "Unauthorized Attempt"
        })
      }
    }
  }
  else{
    res.status(401).json({
      success: false,
      message: "Please log in.  If you are, please clear your cookies and try again."
    })
  }
}

function saveJSON(path, json){
  fetch("https://replverse-data.ironcladdev.repl.co/save/" + path.split`/`[2], {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept": "*/*"
    },
    body: JSON.stringify({
      auth: process.env.ADMSS,
      json
    })
  })
}

//title, link, cont, icon, userFor, r
async function writeNotif(stats){
  let notifs = await getData("notifs.json", {})
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

function updateApps(req, res, ft){
  ft("https://" + req.headers.host + "/api/cron", {
    headers: {
      'Content-Type': "application/json",
      accept: "*/*"
    },
    method: "POST",
    body: JSON.stringify({
      ['{"pass": "'+process.env.CRON_PASSWORD+'", "user": "'+process.env.CRON_USER+'"}']: ""
    })
  })
}

function testTrend(t, y, z) {
  let T = (t[1] / (t[0] + 1) * (t[1] + 5)) + 1;
  let Y = (y[1] / (y[0] + 1) * (y[1] + 5));
  let Z = z||10;
  if (T - Y <= 0) {
    Z -= Math.abs(T - Y);
  } else {
    Z += Math.abs(T - Y) / 2;
  }
  return (Number(Z.toFixed(2)));
}

async function updateApp(id){
  let _app = await App.findOne({_id: id});
  let appStats = _app.po[1];
  let viewsToday = _app.views - appStats[0];
  let likesToday = _app.likes - appStats[1];
  let newStat = [appStats, [_app.views, _app.likes]];
  _app.po = newStat;
  let prevZ = _app.z;
  _app.z = testTrend(newStat[0], newStat[1], prevZ);
  _app.save();
}


export { md5, admins, limiter, authUser, saveJSON, writeNotif, isAdmin, testTrend, updateApp }