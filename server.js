const express = require("express");
const app = express();

// our imports
const sequelize = require("./config/db");
const User  = require("./models/User");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes

//Server connection
const port = process.env.PORT || 6000; // PORT

// syncing the models with the database and server running
sequelize.sync({ force: true }).then((result) => {

  const user = User.create({
    fullname: 'Raghav Gupta',
    password: '123',
    email: 'rag123@gmail.com',
    rollno: 1,
    classname: 'Engineering'
  }).then(user => {
    console.log(user)
    console.log(user.validatePassword('1234'));
    app.listen(port, () => {

      console.log(`app is runnning at ${port}`);
    });
  })
  
});
