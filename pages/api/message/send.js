import nc from 'next-connect';
import { App } from '../../../scripts/mongo.js'
import { authUser, writeNotif, limiter } from '../../../scripts/util.js'

function alphaPurge(sentence, words){
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
      "\u00e8"
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
      "1",
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

const app = nc();

app.use(limiter(1000 * 60 * 10, 200, function(req, res){
  res.json({
    success: false,
    err: "Too many requests",
    message: "You've been sending messages way too fast.  To prevent botting, replverse stops you from posting a large amount of messages over a period of time."
  })
}))

app.use(limiter(1000 * 60, 30, function(req, res){
  res.json({
    success: false,
    err: "Too many requests",
    message: "You've been sending messages way too fast.  To prevent botting, replverse stops you from posting a large amount of messages over a period of time."
  })
}))

const badWords = [
  "ass","shit","fuck","fucking","damn","asshole","sex","nigger","goddamn",
  "boobs","boob","pussy","nutsack","penis","porn","hentai","motherfucking", "nigga", "dick", "vagina", "bitch"
]

const prefix = ":";

app.post(async (req, res) => {
  authUser(req, res, async (usr) => {
    let findApps = await App.find({ user: usr.name });
    if(findApps.length > 0){
      if(alphaPurge(req.body.data.text, badWords).contains){
        res.status(403).json({
          success: false,
          message: `Whoah, hold up there buddy - We found the word(s) ${alphaPurge(req.body.data.text, badWords).words.join(', ')} in your message.  Please note that bypassing filters or saying a seriously offensive word could get you banned from replverse.`
        })
      }else{
        fetch("https://replverse-data.ironcladdev.repl.co/se/nd/a/me/ssa/ge", {
          method: "POST",
          body: JSON.stringify({
            data: req.body.data,
            auth: process.env.ADMSS
          }),
          headers: {
            "Content-Type": "application/json",
            accept: "*/*"
          }
        }).then(r => r.json()).then(__data => {
          if(__data.success){
            if(req.body.pings.length > 0){
                    for(var i of req.body.pings){
                      writeNotif({
                        title: req.body.data.username + " mentioned you in #" + req.body.data.channel,
                        link: "/chat?channel=" + req.body.data.channel + "#" + req.body.data.id,
                        cont: req.body.data.text,
                        icon: req.body.data.avatar,
                        userFor: i
                      });
                    }
            }
            if(req.body.data.text.startsWith(prefix)){
              fetch("https://replverse-data.ironcladdev.repl.co/bot/se/nd/me/ss/age", {
                method: "POST",
                body: JSON.stringify({
                  command: req.body.data.text,
                  channel: req.body.data.channel,
                  day: req.body.data.day,
                  username: req.body.data.username,
                  auth: process.env.ADMSS
                }),
                headers: {
                  "Content-Type": "application/json",
                  accept: "*/*"
                }
              }).then(r => r.json()).then(ft => {
                if(ft.success){
                  res.json({ success: true });
                }
              })
            }
            else{
              if(__data.success){
                  res.json({ success: true });
              }
            }
          }
        })
      }
    }
    else{
      res.status(401).json({
        success: false,
        message: "You must publish at least one repl on replverse before you can talk."
      })
    }
  })
})

export default app;