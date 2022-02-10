import nc from 'next-connect'
import {User} from '../../../scripts/mongo.js'
const app = nc();

const headers = {
  'X-Requested-With':'replit',
  'Origin':'https://replit.com',
  'Accept':'application/json',
  'Referrer':'https://replit.com/jdog787',
  'Content-Type':'application/json',
  'Connection':'keep-alive',
  'Host': "replit.com",
  "x-requested-with": "XMLHttpRequest",
  "User-Agent": "Mozilla/5.0"
};

app.get(async (req, res) => {
  let findUser = await User.findOne({ name: req.query.username })
  const query = JSON.stringify({
  query: `{userByUsername(username: "${req.query.username}") {karma, firstName, lastName, bio, id, image}}`,
  variables: {
    username: "IroncladDev",
    search: ""
  }
});
  let rs = await fetch('https://replit.com/graphql', {
		method: 'POST',
		headers,
		body: query,
	})
    if(rs.status === 200){
      let data = await rs.json();
      if(data.data.userByUsername){
        let d = {
          ...data.data.userByUsername,
          username: req.query.username,
          icon: {
            url: data.data.userByUsername.image
          },
          exists: findUser ? true : false
        };
        delete d.image;
        res.json(d);
      }else{
        res.json(false)
      }
    }else{
      res.json(false)
    }
})

export default app;