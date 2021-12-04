const express = require("express");
const path = require("path");

const app = express();

const authroutes = require("./api/auth.route");
const sequelize = require("./config/db");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,"..","public")));

//Routes
app.use("/api", authroutes);

//Server connection
const port = process.env.PORT || 6000; // PORT

// syncing the models with the database and server running
sequelize.sync().then((result) => {
  app.listen(port, () => {
    console.log(`app is runnning at ${port}`);
  });
});
