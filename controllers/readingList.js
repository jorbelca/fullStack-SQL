const ReadingListRouter = require("express").Router()
require("express-async-errors")
const { tokenExtractor } = require("../util/middleware")
const User = require("../models/users")
const Readings = require("../models/readings")

ReadingListRouter.post("/", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if (user) {
      const newReading = await Readings.create({
        ...req.body,
      })
      res.json(newReading)
    }
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error })
  }
})

module.exports = ReadingListRouter
