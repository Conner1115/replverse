import nc from 'next-connect'
import superagent from 'superagent'
const app = nc();
app.get((req, res) => {
  superagent.get("https://replit.com/data/profiles/" + req.query.username).end((err, rs) => {
    if(rs.status === 200){
      res.json(rs.body);
    }else{
      res.json(false)
    }
  })
})

export default app;