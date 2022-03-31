const express = require("express")
const app = express()

const { PORT } = require("./util/config")
const { connectToDatabase } = require("./util/db")

const BlogRouter = require("./controllers/blogs")
const UserRouter = require("./controllers/users")
const LoginRouter = require("./controllers/login")

app.use(express.json())
app.use("/api/blogs", BlogRouter)
app.use("/api/users", UserRouter)
app.use("/api/login", LoginRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
