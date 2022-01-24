import nc from 'next-connect'
import superagent from 'superagent'
const app = nc();
app.get((req, res) => {
  superagent.get("https://replit.com/data/profiles/" + req.headers["x-replit-user-name"]).end((err, rs) => {
    if(rs.status === 200){
      res.json(rs.body);
    }else{
      res.json(false)
    }
  })
})

export default app;