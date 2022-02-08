import nc from 'next-connect';
import { authUser } from '../../../scripts/util.js'

const app = nc();

app.post(async (req, res) => {
  authUser(req, res, async (usr) => {
    let ft = await fetch("https://replverse-data.ironcladdev.repl.co/del/ete/mess/age", {
      method: "POST",
      body: JSON.stringify({
        id: req.body.id,
        auth: process.env.ADMSS
      }),
      headers: {
        "Content-Type": "application/json",
        accept: "*/*"
      }
    }).then(r => r.json())
    if(ft.success){
      res.json({ success: true });
    }
    else{
      res.json({
        success: false,
        message: "Unauthorized Attempt"
      })
    }
  })
})

export default app;