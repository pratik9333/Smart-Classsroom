const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Class = sequelize.define(
  "class",
  {
    name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    section: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = Class;
