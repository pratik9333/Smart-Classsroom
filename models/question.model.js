const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Question = sequelize.define("question", {
  heading: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
});

module.exports = Question;
