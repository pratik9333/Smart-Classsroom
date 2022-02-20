const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Class = sequelize.define("class", {
  className: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  numberOfStudents: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
},{timestamps: true});

module.exports = Class;
