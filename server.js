const express = require("express");
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes

//DB Connection

//Server connection
const port = process.env.PORT || 5000; // PORT
app.listen(port, () => {
  console.log(`app is runnning at ${port}`);
});
