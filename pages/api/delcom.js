import nc from 'next-connect';
import superagent from 'superagent'
import { App } from '../../scripts/mongo.js'
import { limiter, authUser } from '../../scripts/util.js'

const app = nc();

app.post(async (req, res) => {
  authUser(req, res, async (usr) => {
    let findRepl = await App.findOne({ repl: req.body.repl, user: req.body.author });
    if(findRepl){
      findRepl.comments = findRepl.comments.filter(x => x.id !== req.body.id);
      findRepl.save();
  
      res.json({
        success: true,
        data: findRepl.comments
      })
    }else{
      res.status(404).json({
        success: false,
        message: "Repl Not Found",
        err: "Repl Not Found"
      })
    }
  })
})

export default app;