const jwt = require("jsonwebtoken")
const Sessions = require("../models/sessions")
const { SECRET } = require("./config")

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: "token invalid" })
    }
  } else {
    return res.status(401).json({ error: "token missing" })
  }
  next()
}
const sessionVerifier = async (req, res, next) => {
  const session = await Sessions.findOne({
    where: {
      userId: jwt.verify(req.get("authorization").substring(7), SECRET).id,
    },
  })
  if (session) {
    res.json("Session verified")
    next()
  } else {
    return res.status(401).json("Session not verified")
  }
}

const sessionCreator = async (req, res, next) => {
  try {
    await Sessions.create({
      token: req.get("authorization").substring(7),
      userId: jwt.verify(req.get("authorization").substring(7), SECRET).id,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    })
    res.json("Session established")
  } catch (error) {
    return res.status(400).json({ error })
  }
  next()
}

module.exports = { tokenExtractor, sessionCreator, sessionVerifier }
