import nc from 'next-connect';
import superagent from 'superagent'
import { App } from '../../scripts/mongo.js'
import { limiter, authUser } from '../../scripts/util.js'

const app = nc();

app.use(limiter(1000 * 60 * 30, 6, function(req, res){
  res.json({
    success: false,
    err: "Too many requests - please try again later",
    message: "Too many requests - please try again later."
  })
}))

app.post(async (req, res) => {
  authUser(req, res, async (usr) => {
    let repl = req.body.repl;
  	let user = usr.name;
    let userData = await fetch("https://" + req.headers.host + "/api/user/" + user).then(r => r.json())
    let findApp = await App.findOne({
      user, repl
    });
    if(findApp){
  	  superagent.get("https://replit.com/data/repls/@" + user + "/" + repl).end(async (err, rs) => {
  		if (rs.status === 200) {
  			let json = rs.body;
  			let screenshot = "/graphics/image.svg";
  			if (json.language === "html" || json.config.isServer) {
  				let url = `https://${json.slug.toLowerCase()}.${user.toLowerCase()}.repl.co`;
  				let bs4 = await fetch("https://webshotty.herokuapp.com/?url=" + url).then(r=>r.json())
  				let upload = await fetch("https://replqapi.ironcladdev.repl.co/upload-image", {
  					method: "POST",
  					headers: {
  						"Content-Type": "application/json",
  						"accept": "*/*"
  					},
  					body: JSON.stringify({
  						url: bs4.image
  					})
  				}).then(r=>r.json())
  				let screenshot = upload.image || "/graphics/image.svg";
          findApp.cover = screenshot;
          findApp.description = json.description;
          findApp.avatar = userData.icon.url;
  				findApp.save();
  				res.json({
  					success: true,
  					slug: json.slug,
  					user
  				})
  			} else {
  				findApp.cover = screenshot;
          findApp.description = json.description;
          findApp.avatar = userData.icon.url;
  				findApp.save();
  				res.json({
  					success: true,
  					slug: json.slug,
  					user
  				})
  			}
  		}
  	})
    }else{
      res.status(404).json({
        success: false,
        message: "Repl Doesn't Exist"
      })
    }
  });
})

export default app;