import nc from 'next-connect';
import superagent from 'superagent'
import { App, User } from '../../scripts/mongo.js'
import { limiter, authUser, saveJSON, updateApps } from '../../scripts/util.js'
import fs from 'fs'

import records from '../../data/records.json'
let rec = [...records];

const app = nc();

app.post(async (req, res) => {
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
        updateApps(req, res, fetch);
        res.json({
          success: true,
          count: -1
        });
      }else{
        findApp.likes++;
        findApp.save();
        rec.push({type: "like", user, repl, author: req.body.author});
        saveJSON('/data/records.json', rec);
        updateApps(req, res, fetch);
        res.json({
          success: true,
          count: 1
        });
      }
  });
})

export default app;