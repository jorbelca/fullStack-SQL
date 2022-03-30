require("dotenv").config()
const { Sequelize, Model, DataTypes } = require("sequelize")
const express = require("express")
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  }
)

Blog.sync()

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(express.json())

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (e) {
    console.error(e)
  }
})

app.post("/api/blogs", async (req, res) => {
  try {
    console.log(req.body)
    const newBlog = await Blog.create(req.body)
    res.json(newBlog)
  } catch (e) {
    console.error(e)
  }
})

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      await blog.destroy()
      res.status(200).json("Correctly deleted")
    } else {
      res.status(404).end()
    }
  } catch (e) {
    console.error(e)
  }
})
