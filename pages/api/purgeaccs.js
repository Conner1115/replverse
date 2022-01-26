import nc from 'next-connect';
import superagent from 'superagent'
import { User } from '../../scripts/mongo.js'

const app = nc();

app.post(async (req, res) => {
  let body = JSON.parse(Object.keys(req.body)[0]);
  if(body.pass === process.env.CRON_PASSWORD && body.user === process.env.CRON_USER){
    User.remove({ verified: false }, (err, rs) => {
      if(err){
        res.status(500).json({
          success: false
        })
      }
      if(rs){
        console.log("[--UNVERIFIED ACCOUNTS PURGED--]")
        res.status(200).json({
          success: true
        })
      }
    })
  }
})

export default app;