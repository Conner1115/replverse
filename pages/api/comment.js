import nc from 'next-connect';
import { App } from '../../scripts/mongo.js'
import { limiter, authUser, writeNotif } from '../../scripts/util.js'

const app = nc();

app.use(limiter(1000 * 60 * 30, 10, function(req, res){
  res.json({
    success: false,
    err: "Too many requests - please try again later.",
    message: "Too many requests - please try again later."
  })
}))

app.post(async (req, res) => {
  authUser(req, res, async (usr) => {
    let repl = req.body.repl;
    let user = usr.name;
    let content = req.body.value;
    let userData = await fetch("https://" + req.headers.host + "/api/user/" + user).then(r => r.json());
    let findApp = await App.findOne({ repl: req.body.repl, user: req.body.author });
    findApp.comments.push({
      user,
      avatar: userData.icon.url,
      content: req.body.value,
      id: Math.random().toString(36).slice(2)
    })
    findApp.save();
    if(req.body.author !== user){
      writeNotif({
        title: `${user} commented on ${req.body.repl}`,
        link: `/repl/${req.body.author}/${req.body.repl}`,
        cont: req.body.value,
        icon: userData.icon.url,
        userFor: req.body.author
      });
    }
    res.json({
      success: true,
      data: findApp.comments
    });
  })
})

export default app;