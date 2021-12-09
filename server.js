const express = require("express");
const path = require("path");

const app = express();

//serve images statically
app.use('/static', express.static(path.join(__dirname, 'public')))

// routes
const authRoutes = require("./api/auth.route");
const userRoutes = require("./api/user.route");

const sequelize = require("./config/db");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Routes
app.use("/api", authRoutes);
app.use("/user",userRoutes);

//Server connection
const port = process.env.PORT || 8000; // PORT

// syncing the models with the database and server running
sequelize.sync().then((result) => {
  app.listen(port, () => {
    console.log(`app is runnning at ${port}`);
  });
});
