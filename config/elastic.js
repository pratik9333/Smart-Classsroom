require("dotenv").config({ path: __dirname + "/.env" });

const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: `http://${process.env.ELASTIC_SEARCH_HOST}:${process.env.ELASTIC_SEARCH_PORT}`,
});

module.exports = client;
