import nc from 'next-connect';
import { App, User } from '../../scripts/mongo.js'
import { limiter, authUser, saveJSON } from '../../scripts/util.js'
import {getData} from '../../scripts/json.js'

const app = nc();

app.use(limiter(1000 * 60 * 30, 10, function(req, res){
  res.json({
    success: false,
    err: "Too many requests - please try again later",
    message: "Too many requests - please try again later."
  })
}))

app.post(async (req, res) => {
  let rep = await getData("reports.json", {})
  authUser(req, res, async (usr) => {
      let repl = req.body.repl;
      let author = req.body.author;
      let findRepl = rep.filter(x => x[2] === repl)[0];
    if(findRepl){
      res.json({
        success: false,
        message: "Repl was already reported",
        err: "Repl was already reported"
      })
    }else{
      rep = [...rep, ["https://" + req.headers.host + "/repl/" + `${author}/${repl}`, req.body.reason, repl]];
      saveJSON("/data/reports.json", rep);
       res.json({
        success: true
      })
    }
  });
})

export default app;