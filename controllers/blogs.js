const BlogRouter = require("express").Router()
require("express-async-errors")

const Blog = require("../models/blogs")
const User = require("../models/users")
const { SECRET } = require("../util/config")

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      console.log(authorization)
      console.log(SECRET)
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      res.status(401).json({ error: "token invalid" })
    }
  } else {
    res.status(401).json({ error: "token missing" })
  }
  next()
}

BlogRouter.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
  })
  res.json(blogs)
})

BlogRouter.post("/", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const newBlog = await Blog.create({ ...req.body, userId: user.id })
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

BlogRouter.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
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

module.exports = BlogRouter
