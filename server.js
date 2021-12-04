const express = require("express");
const sequelize = require("./config/db");
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes

//Server connection
const port = process.env.PORT || 6000; // PORT

// syncing the models with the database and server running
sequelize.sync().then((result) => {
  app.listen(port, () => {
    console.log(`app is runnning at ${port}`);
  });
});
