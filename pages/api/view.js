import nc from 'next-connect';
import { App, User } from '../../scripts/mongo.js'
import { limiter, authUser, saveJSON } from '../../scripts/util.js'
import {getData} from '../../scripts/json.js'

const app = nc();

app.post(async (req, res) => {
  let rec = await getData("records.json", {})
  authUser(req, res, async (usr) => {
      let repl = req.body.repl;
      let author = req.body.author;
      let me = usr.name;
      let findApp = await App.findOne({ repl: req.body.repl, user: req.body.author });
    if(findApp){
      let findRecord = rec.filter(x => x.type === "v" && x.user === me && x.repl === repl && x.author === author)[0];
      if(findRecord){
        res.json({
          success: true
        })
      } else {
        rec.push({
          type: "v",
          user: me,
          repl,
          author
        });
        saveJSON("/data/records.json", rec);
        findApp.views++;
        if(findApp.views % 5 === 0){
          findApp.z--;
        }
        findApp.save();
        res.json({
          success: true
        })
      }
    }else{
      res.status(404).json({
        success: false,
        message: "Repl not found",
        err: "Repl not found"
      })
    }
  });
})

export default app;