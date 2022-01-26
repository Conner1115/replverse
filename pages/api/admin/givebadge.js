import nc from 'next-connect';
import superagent from 'superagent'
import { User } from '../../../scripts/mongo.js'
import { limiter, authUser, writeNotif, saveJSON } from '../../../scripts/util.js'
import awards from '../../../data/awards.json'
let aw = [...awards];

const app = nc();

let bds = [
  ["Loyal Repler", "loyal-repler"],
  ["Replverse Developer", "dev"],
  ["Repldigest Author", "digest"],
  ["Replit Team", "replit-team"]
];

app.post(async (req, res) => {
  authUser(req, res, async (usr) => {
      if(JSON.parse(process.env.SUPERIOR_ADMINS).includes(usr.name)){
        let user = req.body.user;
        let num = req.body.badge;
        let parseNum = +num;
        if(parseNum){
          if(parseNum && +parseNum > 0 && +parseNum < 5){
            let findUser = await User.findOne({ name: user });
            let adminData = await fetch("https://" + req.headers.host + "/api/user/" + usr.name).then(r => r.json());
            writeNotif({
              title: `You got a badge`,
              link: `/dashboard`,
              cont: "An administrator just gave you the badge " + bds[parseNum-1][0],
              icon: "/badges/" + bds[parseNum-1][1] + ".svg",
              userFor: findUser.name
            });
            let findUserBd = aw.filter(x => x.user === user)[0];
            if(findUserBd){
              let newAw = aw.map(x => {
                let a = x;
                if(a.user === user){
                  a.badges.push(bds[parseNum-1]);
                }
                return a;
              })
              saveJSON("/data/awards.json", newAw)
            }else{
              aw.push({user, badges: [bds[parseNum-1]]})
              saveJSON("/data/awards.json", aw)
            }
            res.json({
              success: true
            })
          }else{
            res.json({
              success: false,
              message: "Badge does not exist"
            })
          }
        }
      }else{
        res.json({
          success: false,
          message: "Unauthorized Attempt",
          err: ""
        })
      }
  })
})

export default app;