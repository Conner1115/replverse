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

//some thingies people shouldn't have in repls
let words = [
  "nuker",
  "nuke",
  "selfbot",
  "raid",
  "token",
  "nitro",
  "sniper",
  "dank",
  "unblock",
  "browser",
  "firefox",
  "chrome",
  "nsfw",
  "shit",
  "fuck",
  "ass",
  "pussy"
]

function alphaPurge(sentence, words){
  /*
    alphaPurge function made by LeviathanProgramming (@LeviathanCoding at Replit)
  */
  if(typeof sentence !== "string") throw new Error("alphaPurge parameter 'sentence' must be a string");
  if(!Array.isArray(words)) throw new Error("alphaPurge paramater 'words' must be an array")
  const glyphs = {
    "a": [
      "a",
      "å",
      "@",
      "\u0430",
      "\u00e0",
      "\u00e1",
      "\u1ea1",
      "\u0105"
    ],
    "b": [
      'b'
    ],
    "c": [
      "c",
      "\u0441",
      "\u0188",
      "\u010b"
    ],
    "d": [
      "∂",
      "d",
      "\u0501",
      "\u0257"
    ],
    "e": [
      "e",
      "\u0435",
      "\u1eb9",
      "\u0117",
      "\u0117",
      "\u00e9",
      "\u00e8",
      "3"
    ],
    "f": [
      'f'
    ],
    "g": [
      "g",
      "\u0121"
    ],
    "h": [
      "h",
      "\u04bb"
    ],
    "i": [
      "i",
      "î",
      "¡",
      "!",
      "\u0456",
      "\u00ed",
      "\u00ec",
      "\u00ef"
    ],
    "j": [
      "j",
      "\u0458",
      "\u029d"
    ],
    "k": [
      "k",
      "\u03ba"
    ],
    "l": [
      "l",
      "\u04cf",
      "\u1e37"
    ],
    "m": ["m"],
    "n": [
      "n",
      "\u0578"
    ],
    "o": [
      "o",
      "ø",
      "\u043e",
      "\u03bf",
      "\u0585",
      "\u022f",
      "\u1ecd",
      "\u1ecf",
      "\u01a1",
      "\u00f6",
      "\u00f3",
      "\u00f2"
    ],
    "p": [
      "p",
      "\u0440"
    ],
    "q": [
      "q",
      "\u0566"
    ],
    "r": ["r"],
    "s": [
      "s",
      "$",
      "\u0282"
    ],
    "t": ["t", "†"],
    "u": [
      "u",
      "\u03c5",
      "\u057d",
      "\u00fc",
      "\u00fa",
      "\u00f9"
    ],
    "v": [
      "v",
      "\u03bd",
      "\u0475"
    ],
    "w": ['w'],
    "x": [
      "x",
      "\u0445",
      "\u04b3"
    ],
    "y": [
      "y",
      "\u0443",
      "\u00fd"
    ],
    "z": [
      "z",
      "\u0290",
      "\u017c"
    ]
  }
  let contains = false,
  s = sentence.toLowerCase(),
  antiGlyph = "",
  wds = [],
  glyphKeys = Object.keys(glyphs);
  for(var j = 0; j < s.length; j++){
    let char = s[j];
    for(var i = Object.values(glyphs).length; i--;){
      let arr = Object.values(glyphs)[i];
      if(arr.includes(s[j]))char = glyphKeys[i];
    }
    antiGlyph += char;
  }
  let filters = [
    antiGlyph.replace(/\u200b/g, ""),
    antiGlyph.replace(/[\-\_]/g, ""),
  ]
  for(let i = filters.length; i--;){
    let arr = filters[i].split(/[\s\,\!\?]/)
    for(var j = arr.length; j--;){
      if(words.includes(arr[j])){
        contains = true;
        wds.push(arr[j])
      }
    }
  }
  return {
    contains: contains,
    words: [...new Set(wds)],
  }
}

const headers = {
  'X-Requested-With':'replit',
  'Origin':'https://replit.com',
  'Accept':'application/json',
  'Referrer':'https://replit.com/jdog787',
  'Content-Type':'application/json',
  'Connection':'keep-alive',
  'Host': "replit.com",
  "x-requested-with": "XMLHttpRequest",
  "User-Agent": "Mozilla/5.0"
};

app.get((req, res) => {
  let repl = req.query.q;
  let user = req.headers["x-replit-user-name"];
  superagent.get("https://replit.com/data/repls/@" + user + "/" + repl).end((err, rs) => {
    let detect = alphaPurge(repl, words)
    if(detect.contains){
      res.json({
        status: 1,
        message: `Found ${detect.words.map(x => `"${x}"`).join(', ')}.  Please follow ToS and keep things clean.`
      })
    }else{
      if(rs.status === 200){
        res.json({
          status: 0,
          lang: convert[rs.body.language],
          message: `${repl} is available`
        })
      }else{
        res.json({
          status: 1,
          message: "Repl Not Found"
        })
      }
    }
  })
})

export default app;