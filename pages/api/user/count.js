import nc from 'next-connect'
import { User } from '../../../scripts/mongo.js'
const app = nc();

app.get(async (req, res) => {
  let users = await User.countDocuments({});
  res.json(users);
})

export default app;