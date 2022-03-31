const router = require("express").Router()
require("express-async-errors")
const Blog = require("../models/blogs")

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post("/", async (req, res) => {
  const newBlog = await Blog.create(req.body)
  res.json(newBlog)
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)

  next()
}

router.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy()
    res.status(200).json("Correctly deleted")
  } else {
    res.status(404).end()
  }
})

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(`likes: ` + req.body.likes)
  } else {
    res.status(404).end()
  }
})

module.exports = router
