import nc from 'next-connect';
import { App } from '../../scripts/mongo.js'
import {testTrend, updateApp} from '../../scripts/util.js'

const app = nc();


app.post(async (req, res) => {
  let body = JSON.parse(Object.keys(req.body)[0]);
  if(body.pass === process.env.CRON_PASSWORD && body.user === process.env.CRON_USER){

    let apps = await App.find({}, '_id');
    for(var i = apps.length; i--;){
      let id = apps[i]._id;
      updateApp(id);
    }
    res.status(200).json({
      success: true
    })
  }
})

export default app;