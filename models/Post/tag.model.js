const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Tag = sequelize.define("tag", {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

module.exports = Tag;
