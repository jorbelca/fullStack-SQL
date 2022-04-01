const express = require("express")
const app = express()

const { PORT } = require("./util/config")
const { connectToDatabase } = require("./util/db")

const BlogRouter = require("./controllers/blogs")
const UserRouter = require("./controllers/users")
const LoginRouter = require("./controllers/login")
const AuthorRouter = require("./controllers/authors")

app.use(express.json())
app.use("/api/blogs", BlogRouter)
app.use("/api/users", UserRouter)
app.use("/api/login", LoginRouter)
app.use("/api/authors", AuthorRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
