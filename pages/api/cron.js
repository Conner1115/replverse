import nc from 'next-connect';
import { App } from '../../scripts/mongo.js'

const app = nc();

//t is an object with fields "likes" and "views" for the current state.
//y is an object with the same fields for a past state in the last cron update
function testTrend(t, y, z) {
  let T = (t[1] / (t[0] + 1) * (t[1] + 5));
  let Y = (y[1] / (y[0] + 1) * (y[1] + 5));
  let Z = z||10;
  if (T - Y <= 0) {
    Z -= Math.abs(T - Y);
  } else {
    Z += Math.abs(T - Y) / 2;
  }
  return (Number(Z.toFixed(2))) - 0.25;
}

app.post(async (req, res) => {
  let body = JSON.parse(Object.keys(req.body)[0]);
  if(body.pass === process.env.CRON_PASSWORD && body.user === process.env.CRON_USER){

    let apps = await App.find({}, '_id');
    for(var i = apps.length; i--;){
      let id = apps[i]._id;
      let _app = await App.findOne({_id: id});
      let appStats = _app.po[1];
      let viewsToday = _app.views - appStats[0];
      let likesToday = _app.likes - appStats[1];
      let newStat = [appStats, [viewsToday, likesToday]];
      _app.po = newStat;
      let prevZ = _app.z;
      _app.z = testTrend(newStat[1], newStat[0], prevZ);
      _app.save();
    }
    res.status(200).json({
      success: true
    })
  }
})

export default app;