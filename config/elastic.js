require("dotenv").config({ path: __dirname + "/.env" });

const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: "http://54.234.24.159:9200",
});

module.exports = client;