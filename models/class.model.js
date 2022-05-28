const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const crypto = require("crypto");

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
    classCode: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true }
);

Class.beforeCreate((cls, options) => {
  // generating unique class code before creating class
  cls.classCode = crypto.randomBytes(6).toString("hex");
});

module.exports = Class;
