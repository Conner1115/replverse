import nc from 'next-connect'
import md5 from 'md5'
import superagent from 'superagent'
import { User } from '../../scripts/mongo.js'
import requestIp from 'request-ip'
import { authUser } from '../../scripts/util.js'

const app = nc();


//MAKE SURE EMAIL IS EQUAL TO USER ACCOUNT
//USERNAME IS UNDEFINED
app.post(async (req, res) => {
  authUser(req, res, async (usr) => {
    let findUser = await User.findOne({ name: usr.name });
    if(req.body.email === findUser.email){
      fetch("https://replverse-api.ironcladdev.repl.co/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "*/*"
          },
          body: JSON.stringify({
            auth: process.env.ADMSS,
            to: req.body.email,
            subject: "Verify Account Deletion",
            body: `Hello, ${usr.name},<br><br>We're really sorry to see you go. To complete the final step in deleting your account, please click <a href="https://replverse.ironcladdev.repl.co/api/verifydelete/${usr.token}">this link</a> and the deed will be done.`
          })
      })
      .then(r => r.json()).then(sent => {
          if(sent.success){
            res.json({ success: true })
          }else{
            res.json({ success: false, message: sent.message, err: "Failed to send email" })
          }
        })
    }else{
      res.json({
        success: false,
        message: "Email does not match account.  Please try again.",
        err: "Incorrect Email"
      })
    }
  })
})

export default app;