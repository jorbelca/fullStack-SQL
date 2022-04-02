const AuthorRouter = require("express").Router()
const sequelize = require("sequelize")

const { Blog, User } = require("../models")

AuthorRouter.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("author")), "articles"],
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
    ],
    group: ["author"],
    order: [sequelize.col("likes")],
  })

  res.json(authors)
})

module.exports = AuthorRouter
