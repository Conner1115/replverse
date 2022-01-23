import nc from 'next-connect'
import superagent from 'superagent'
const app = nc();
app.get(async (req, res) => {
  let __data = await superagent.get("https://replit.com/data/profiles/" + req.query.username)
  let data = JSON.parse(__data.text);
  if(data){
    res.json(data)
  }else{
    res.json(false)
  }
})

export default app;