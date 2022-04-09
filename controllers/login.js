const jwt = require("jsonwebtoken")
const LoginRouter = require("express").Router()

const { SECRET } = require("../util/config")
const User = require("../models/users")
const { sessionCreator } = require("../util/middleware")

LoginRouter.post("/", async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  })

  const passwordCorrect = body.password === "secret"

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    })
  }
  if (user.disabled) {
    return response.status(401).json({ error: "You're  disabled" })
  }
  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)
  sessionCreator(token)

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = LoginRouter
