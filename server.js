const express = require("express");
const sequelize = require("./db");
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes



//Server connection
const port = process.env.PORT || 5000; // PORT


sequelize.sync().then(result=>{
  app.listen(port, () => {
    console.log(`app is runnning at ${port}`);
  });
})

