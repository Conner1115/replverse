import nc from 'next-connect';
import { App } from '../../scripts/mongo.js'

const app = nc();


app.get(async (req, res) => {
  let tags = req.query.tags ? JSON.parse(req.query.tags) : false
  let search = {
    $or: [{
      repl: { $regex: new RegExp(req.query.search), $options: "i" }
    }, {
      desc: { $regex: new RegExp(req.query.search), $options: "i" }
    }],
  }
  if(tags.length > 0 && tags){
    search.tags = { $in: tags.map(t => new RegExp(t, "i")) }
  }
  if(!req.query.search){
    delete search.$or;
  }
  let apps = await App.find(search).limit(Number(req.query.limit || '100'));
  let arr = [...apps]
  if(req.query.filter === "old"){
    res.json(await App.find(search).limit(Number(req.query.limit || '100')));
  } else if(req.query.filter === "new"){
    res.json([...await App.find(search).limit(Number(req.query.limit || '100'))].reverse());
  } else if(req.query.filter === "hot"){
    res.json(arr.sort((a, b) => b.z - a.z))
  } else if(req.query.filter === "top") {
    res.json(arr.sort((a, b) => b.likes - a.likes))
  } else{
    res.json(false)
  }
})

export default app;