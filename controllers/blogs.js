const BlogRouter = require("express").Router()
require("express-async-errors")

const { Op } = require("sequelize")

const Blog = require("../models/blogs")
const User = require("../models/users")

const { tokenExtractor, sessionCreator } = require("../util/middleware")

BlogRouter.get("/", async (req, res) => {
  let where = {}

  if (req.query.search) {
    const querySearch = req.query.search.toLowerCase()
    where = {
      [Op.or]: [
        {
          title: { [Op.like]: `%${querySearch}%` },
        },
        {
          author: { [Op.like]: `%${querySearch}%` },
        },
      ],
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
  })
  res.json(blogs)
})

BlogRouter.post("/", tokenExtractor, sessionCreator, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const newBlog = await Blog.create({
      ...req.body,
      userId: user.id,
      author: user.name,
    })
    res.json(newBlog)
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error })
  }
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)

  next()
}

BlogRouter.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (req.blog && user) {
    await req.blog.destroy()
    res.status(200).json("Correctly deleted")
  } else {
    res.status(404).end()
  }
})

BlogRouter.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(`likes: ` + req.body.likes)
  } else {
    res.status(404).end()
  }
})

BlogRouter.get("/:id", async (req, res) => {
  const blogs = await Blog.findOne({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where: {
      id: req.params.id,
    },
  })
  res.json(blogs)
})

module.exports = BlogRouter
