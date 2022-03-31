const Blog = require("./blogs")
const User = require("./users")

Blog.sync()
User.sync()

User.hasMany(Blog)
Blog.belongsTo(User)
Blog.sync({ alter: true })
User.sync({ alter: true })

module.exports = {
  Blog,
  User,
}
