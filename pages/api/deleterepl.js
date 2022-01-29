import nc from 'next-connect';
import { App } from '../../scripts/mongo.js'
import { limiter, authUser, saveJSON } from '../../scripts/util.js'
import {getData} from '../../scripts/json.js'

const app = nc();

app.post(async (req, res) => {
  let rec = await getData("records.json", {})
  authUser(req, res, async (usr) => {
    let repl = req.body.repl;
    let author = req.body.author;
  	let user = usr.name;
    let findApp = await App.findOne({
      user, repl
    });
    if(findApp){
      let rc = rec.filter(x => (x.repl+x.author !== repl+author));
      saveJSON("/data/records.json", rc)
  	  findApp.remove();
      res.json({
        success: true
      })
    }else{
      res.status(404).json({
        success: false,
        message: "Repl Doesn't Exist",
        err: "Repl Does not exist"
      })
    }
  });
})

export default app;