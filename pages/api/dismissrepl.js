import nc from 'next-connect';
import superagent from 'superagent'
import { App, User } from '../../scripts/mongo.js'
import { limiter, authUser, saveJSON } from '../../scripts/util.js'
import reports from '../../data/reports.json';
let rep = [...reports];

const app = nc();

app.post(async (req, res) => {
  authUser(req, res, async (usr) => {
    let findRepl = rep.filter(x => x[0] === req.body.link)[0];
    if(JSON.parse(process.env.ADMINS).includes(usr.name)){
      if(findRepl){
        let r = rep.filter(x => x[0] !== req.body.link);
        saveJSON("/data/reports.json", r);
        res.json({
          success: true,
          data: r
        })
      }else{
        res.json({
          success: false,
          message: "Repl was already reported",
          err: "Repl was already reported"
        })
      }
    }else{
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }
    /*let findRepl = rep.filter(x => x[0] === req.body.link)[0];
    if(findRepl){
      let r = rep.filter(x => x[0] !== req.body.link)[0];
      saveJSON("/data/reports.json", r);
       res.json({
        success: true
      })
    }else{
      res.json({
        success: false,
        message: "Repl was already reported",
        err: "Repl was already reported"
      })
    }
    }else{
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }*/
  });
  
})

export default app;