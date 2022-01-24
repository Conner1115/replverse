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

const app = nc();

app.get((req, res) => {
  let repl = req.query.q;
  let user = req.headers["x-replit-user-name"];
  superagent.get("https://replit.com/data/repls/@" + user + "/" + repl).end((err, rs) => {
    if(rs.status === 200){
        res.json({
          status: 0,
          lang: convert[rs.body.language]
        })
    }else{
      res.json({
        status: 1
      })
    }
  })
})

export default app;