const jwt = require("jsonwebtoken")
const Sessions = require("../models/sessions")
const User = require("../models/users")
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

const sessionCreator = async (token, next) => {
  const user_id = jwt.verify(token, SECRET).id

  const user = await User.findOne({
    where: {
      id: user_id,
    },
  })

  if (user.disabled) {
    return res.status(401).json("You're  disabled")
  }

  const oldSession = await Sessions.findOne({
    where: {
      userId: user_id,
    },
  })

  if (oldSession) {
    // UPDATE THE TOKEN AND THE DATE OF THE SESSION IF THERE IS A REGISTER OF THE USER ID
    await Sessions.update(
      {
        token: token,
        userId: user_id,
        createdAt: oldSession.dataValues.createdAt,
        updatedAt: new Date().toLocaleString(),
      },
      {
        where: {
          userId: user_id,
        },
      }
    )
  } else {
    try {
      // CREATE SESSION
      await Sessions.create({
        token: token,
        userId: user_id,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      })
      res.json("Session established")
    } catch (error) {
      return res.status(400).json({ error })
    }
    next()
  }
}

module.exports = { tokenExtractor, sessionCreator, sessionVerifier }
