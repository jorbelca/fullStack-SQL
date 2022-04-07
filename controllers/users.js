const UserRouter = require("express").Router()

const User = require("../models/users")
const Blog = require("../models/blogs")

const { Op } = require("sequelize")

UserRouter.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  })
  res.json(users)
})

UserRouter.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

UserRouter.get("/:id", async (req, res) => {
  let where = {}

  if (req.query.read) {
    const queryRead = req.query.read.toLowerCase()
    where = {
      read: { [Op.eq]: `${queryRead}` },
    }
  }
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        attributes: {
          include: ["url", "title", "author", "likes", "year"],
          exclude: ["createdAt", "updatedAt", "userId"],
        },
        through: {
          where: where,
          attributes: {
            exclude: ["userId", "blogId"],
          },
        },
      },
    ],
  })
  if (user) {
    const finalUser = {
      name: user.name,
      username: user.username,
      readings: user.blogs,
    }
    res.json(finalUser)
  } else {
    res.status(404).end()
  }
})

UserRouter.put("/:username", async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } })

  if (user) {
    user.username = req.body.newUsername
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = UserRouter
