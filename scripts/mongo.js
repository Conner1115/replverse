import mongoose from 'mongoose'

const appSchema = new mongoose.Schema({
  user: { type: String, index: true },
  repl: { type: String, index: true },
  views: { type: Number, index: true, default: 0 },
  likes: { type: Number, index: true, default: 0 },
  comments: { type: Array, index: true, default: [] },
  slug: { type: String, index: true },
  cover: { type: String, index: true, default: "/graphics/image.svg" },
  tags: { type: Array, index: true, default: [] },
  avatar: { type: String, index: true },
  desc: { type: String, index: true },
  z: { type: Number, index: true, default: 10 }, //z-score
  po: { type: Array, index: true, default: [[0, 0], [0, 0]]} // popularity over time [views, likes]
})

const userSchema = new mongoose.Schema({
  token: { type: String, index: true },
  verified: { type: Boolean, index: true, default: false },
  name: { type: String, index: true },
  email: { type: String, index: true },
  addr: { type: String, index: true }
})

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const App = mongoose.models.App || mongoose.model("App", appSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

export { App, User }