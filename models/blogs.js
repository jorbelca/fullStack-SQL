const { Model, DataTypes } = require("sequelize")

const { sequelize } = require("../util/db")
const currYear = new Date().getFullYear()

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
    year: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      validate: {
        min: 1991,
        max: currYear,
        customValidator() {
          if (this.year <= 1991 || this.year >= currYear) {
            console.log(currYear)
            throw new Error(
              "The year must be at least equal to 1991 but not greater than the current year."
            )
          }
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "blog",
  }
)

module.exports = Blog
