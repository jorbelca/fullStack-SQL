const UserRouter = require("express").Router()

const { User, Blog } = require("../models")

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
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
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
