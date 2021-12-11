const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Answer = sequelize.define("answer", {
  description: {
    type: DataTypes.STRING(200),
    allowNull: true,
  }
});

module.exports = Answer;
