require("dotenv").config({ path: __dirname + "/.env" });

const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  cloud: {
    id: process.env.CLOUDID,
  },
  auth: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});

module.exports = client;
