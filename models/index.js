const Blog = require("./blogs")
const ReadingList = require("./readingList")
const Readigns = require("./readings")
const User = require("./users")

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(Readigns, { through: ReadingList })
Readigns.belongsToMany(Blog, { through: ReadingList })

module.exports = {
  Blog,
  User,
  Readigns,
  ReadingList,
}
