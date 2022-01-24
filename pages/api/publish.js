/*{
	user: { type: String, index: true },
	repl: { type: String, index: true },
	views: { type: Number, index: true, default: 0 },
	likes: { type: Number, index: true, default: 0 },
	comments: { type: Array, index: true, default: [] },
	slug: { type: String, index: true }
}*/
//body.repl


import nc from 'next-connect';
import superagent from 'superagent'
import { App } from '../../scripts/mongo.js'
import { limiter } from '../../scripts/util.js'

const app = nc();

app.use(limiter(1000 * 60 * 30, 6, function(req, res){
  res.json({
    success: false,
    err: "Too many requests - please try again later",
    message: "Too many requests - please try again later."
  })
}))

app.post(async (req, res) => {
	let repl = req.body.repl;
	let user = req.headers["x-replit-user-name"];
  let findApp = await App.findOne({
    user, repl
  });
  if(!findApp){
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
				let newApp = new App({
					user,
					repl: repl,
					slug: json.slug,
					cover: screenshot
				});
				newApp.save();
				res.json({
					success: true,
					slug: json.slug,
					user
				})
			} else {
				let newApp = new App({
					user,
					repl: repl,
					slug: json.slug,
					cover: screenshot
				});
				newApp.save();
				res.json({
					success: true,
					slug: json.slug,
					user
				})
			}
		}
	})
  }else{
    res.json({
      success: false,
      message: "Repl Already Exists"
    })
  }
})

export default app;