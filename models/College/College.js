const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const College = sequelize.define("College", {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  pincode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(70),
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING(14),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
});

const Class = sequelize.define("Class", {
  divName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

module.exports = { Class, College };
