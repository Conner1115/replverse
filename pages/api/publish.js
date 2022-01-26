/*{
	user: { type: String, index: true },
	repl: { type: String, index: true },
	views: { type: Number, index: true, default: 0 },
	likes: { type: Number, index: true, default: 0 },
	comments: { type: Array, index: true, default: [] },
	slug: { type: String, index: true }
}*/
//body.repl

const convert = {
        "python": "https://replit.com/public/images/languages/python.svg",
        "javascript": "https://replit.com/public/images/languages/javascript.svg",
        "discord": "https://i.ibb.co/0KFDSzF/dsc-removebg-preview.png",
        "java":"https://replit.com/public/images/languages/java.svg",
        "rust": "https://replit.com/public/images/languages/rust.svg",
        "c": "https://replit.com/public/images/languages/c.svg",
        "cpp": "https://replit.com/public/images/languages/cpp.svg",
        "csharp": "https://replit.com/public/images/languages/csharp.svg",
        "nodejs": "https://replit.com/public/images/languages/nodejs.svg",
        "html": "https://replit.com/public/images/languages/web_project.svg",
        "css": "https://i.ibb.co/MCz3w6F/css.png",
        "go": "https://replit.com/public/images/languages/go.svg",
        "mongodb": "https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg",
        "graphql": "https://www.vectorlogo.zone/logos/graphql/graphql-icon.svg",
        "ruby": "https://www.vectorlogo.zone/logos/ruby-lang/ruby-lang-icon.svg",
        "php": "https://replit.com/public/images/languages/php.svg",
        "git-and-github": "https://www.vectorlogo.zone/logos/github/github-icon.svg",
        "bash": "https://icons.util.repl.co/bash.svg",
        "npm": "https://i.ibb.co/P6vbLJF/npm-removebg-preview.png",
        "nix": "https://i.ibb.co/GP699Rp/nix-removebg-preview.png",
        "swift": "https://replit.com/public/images/languages/swift.svg",
        "misc": "https://i.ibb.co/XyhgHdz/code.png",
        "domains": "https://i.ibb.co/PYQtkky/cloudflare-removebg-preview.png",
        "kaboom": "https://replit.com/public/images/languages/kaboom.svg",
        "game-dev": "https://i.ibb.co/y6nSBpD/remotey.png",
        "react": "https://replit.com/public/images/languages/react.svg",
        "haskell": "https://replit.com/public/images/languages/haskell.svg",
        "lua": "https://replit.com/public/images/languages/lua.svg",
        "kotlin": "https://replit.com/public/images/languages/kotlin.svg",
        "sql": "https://i.ibb.co/D4S5W1G/sql.png",
        "typescript": "https://tsnodelogo.masfrost.repl.co/typescript.png",
        "r": "https://storage.googleapis.com/replit/images/1628191744293_21685c2311e9dc3436d7c4fd56e3f286.svg",
        "basic": "https://icons--util.repl.co/basic.svg",
        "dart": "https://storage.googleapis.com/replit/images/1636665353484_9e5440ed2aa1d35a3c3f89b54fd843da.svg",
        "elixir": "https://replit.com/cdn-cgi/image/width=2048,quality=80/https://storage.googleapis.com/replit/images/1628878788071_ac21a2abf28ada8b4dd757549f0ae93f.png",
        "svelte": "https://replit.com/cdn-cgi/image/width=2048,quality=80/https://storage.googleapis.com/replit/images/1629501935458_8e71d2e72b658960c52573564291c1fc.png",
        "scala": "https://storage.googleapis.com/replit/images/1636668211670_ca837dd0d58448a123ec64b960f950bd.svg",
        "crystal": "https://storage.googleapis.com/replit/images/1628878505638_f3f498924021113569741269fda23417.svg"
}

import nc from 'next-connect';
import superagent from 'superagent'
import { App } from '../../scripts/mongo.js'
import { limiter, authUser, writeNotif } from '../../scripts/util.js'
import follows from '../../data/follows.json'

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
    if(!findApp){
  	  superagent.get("https://replit.com/data/repls/@" + user + "/" + repl).end(async (err, rs) => {
  		if (rs.status === 200) {
  			let json = rs.body;
  			let screenshot = "/graphics/image.svg";
  			if (json.language === "html" || json.config.isServer) {
          try{
  				let url = `https://${json.slug.toLowerCase()}.${user.toLowerCase()}.repl.co`;
          //try{
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
    					repl,
    					slug: json.slug,
    					cover: screenshot,
              tags: req.body.tags,
              avatar: userData.icon.url,
              desc: json.description
    				});
    				newApp.save();
            //DO AT ALTERNATE PUBLISH AS WELL
            let fls = follows.filter(x => x.follow === user);
            for(var i = fls.length; i--;){
              writeNotif({
                title: `${user} published ${repl}`,
                link: `/repl/${user}/${repl}`,
                cont: json.description || "The repl has no description.",
                icon: userData.icon.url,
                userFor: fls[i].user
              })
            }
    				res.json({
    					success: true,
    					slug: json.slug,
    					user
    				})
          }catch(e){
            res.json({
              success: false,
              message: "Please make sure your repl is running.  Replverse couldn't get a screenshot of it.",
              err: e
            })
          }
  			} else {
  				let newApp = new App({
  					user,
  					repl: repl,
  					slug: json.slug,
  					cover: convert[json.language],
            tags: req.body.tags,
            avatar: userData.icon.url,
            desc: json.description || ""
  				});
  				newApp.save();
          let fls = follows.filter(x => x.follow === user);
            for(var i = fls.length; i--;){
              writeNotif({
                title: `${user} posted a new repl ${repl}`,
                link: `/repl/${user}/${repl}`,
                cont: json.description || "The repl has no description.",
                icon: userData.icon.url,
                userFor: fls[i].user
              })
            }
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
  });
})

export default app;