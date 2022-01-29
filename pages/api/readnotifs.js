import nc from 'next-connect';
import { App, User } from '../../scripts/mongo.js'
import { limiter, authUser, saveJSON } from '../../scripts/util.js'
import {getData} from '../../scripts/json.js'

const app = nc();

app.post(async (req, res) => {
  let ntfs = await getData("notifs.json", {})
  authUser(req, res, async (usr) => {
    let nts = ntfs.map(x => {
      if(x.userFor === usr.name && !x.r){
        let obj = x;
        obj.r = true;
        return obj;
      }else{
        return x;
      }
    });
    saveJSON("/data/notifs.json", nts);
    res.json({
      success: true,
      data: nts.filter(x => x.userFor === usr.name).reverse()
    })
  });
})

export default app;