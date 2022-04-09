const Sessions = require("../models/sessions")

const LogoutRouter = require("express").Router()

LogoutRouter.delete("/", async (req, res) => {
  if (!req.get("authorization"))
    res.status(400).json({ error: "We need your token" })

  const session = await Sessions.findOne({
    where: {
      token: req.get("authorization").substring(7),
    },
  })

  if (session) {
    await session.destroy()
    res.status(200).json("Session deleted")
  } else {
    res.status(404).end()
  }
})

module.exports = LogoutRouter
