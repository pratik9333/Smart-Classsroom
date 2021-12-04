// load .env file
require("dotenv").config({ path: __dirname + "/.env" });

// sequelize
const { Sequelize } = require("sequelize");

// setup postgresql connection
const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: "postgres",
  }
);

module.exports = sequelize;
