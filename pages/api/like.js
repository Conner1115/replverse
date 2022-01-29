import nc from 'next-connect';
import { App, User } from '../../scripts/mongo.js'
import { authUser, saveJSON, updateApp } from '../../scripts/util.js'
import {getData} from '../../scripts/json.js'

const app = nc();

app.post(async (req, res) => {
  let rec = await getData("records.json", {});
  authUser(req, res, async (usr) => {
      let repl = req.body.repl;
      let user = usr.name;
      let findApp = await App.findOne({ repl: req.body.repl, user: req.body.author });
      let findRecord = rec.filter(x => x.type === "like" && x.user === user && x.repl === repl && x.author === req.body.author)[0];
      if(findRecord){
        rec = rec.filter(x => x.type !== "like" && x.user !== user && x.repl !== repl && x.author !== req.body.author);
        saveJSON('/data/records.json', rec);
        findApp.likes--;
        findApp.save();
        //updateApp(findApp._id);
        res.json({
          success: true,
          count: -1
        });
      }else{
        findApp.likes++;
        findApp.save();
        rec.push({type: "like", user, repl, author: req.body.author});
        saveJSON('/data/records.json', rec);
        //updateApp(findApp._id);
        res.json({
          success: true,
          count: 1
        });
      }
  });
})

export default app;