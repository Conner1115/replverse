import nc from 'next-connect';
import superagent from 'superagent'
import { User, App } from '../../../scripts/mongo.js'
import { saveJSON } from '../../../scripts/util.js'
import records from '../../../data/records.json'
import notifs from '../../../data/notifs.json'
import follows from '../../../data/follows.json'

const app = nc();

app.get(async (req, res) => {
  let findUser = await User.findOne({ token: req.query.token });
  let apps = await App.find({ user: findUser.name }, "_id");
  let recs = records.filter(x => (x.user !== findUser.name && x.author !== findUser.name));
  let ntfs = notifs.filter(x => x.userFor !== findUser.name);
  let flls = follows.filter(x => x.user !== findUser.name && x.follow !== findUser.name)
  saveJSON("/data/notifs.json", ntfs)
  saveJSON("/data/follows.json", flls)
  saveJSON("/data/records.json", recs)
  for(var i of apps){
    let a = await App.findOne({ _id: i });
    a.remove();
  }
  res.setHeader('Set-Cookie', `sid=${req.query.token}; path=/; Max-Age=${1}`);
  findUser.remove();
  res.redirect("/");
})

export default app;