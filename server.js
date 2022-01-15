const express = require("express");
const multer = require("multer");
const path = require("path");
const client = require("./config/elastic");

const { storage } = require("./middlewares/upload.middleware");

// db models
const sequelize = require("./config/db");

const User = require("./models/user.model");
const Question = require("./models/question.model");
const Answer = require("./models/answer.model");
const Tag = require("./models/tag.model");

// routes
const authRoutes = require("./api/auth.route");
const userRoutes = require("./api/user.route");
const questionRoutes = require("./api/question.route");
const answerRoutes = require("./api/answer.route");

const app = express();

//serve images statically
app.use("/public", express.static(path.join(__dirname, "public")));

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// file upload middleware
app.use(multer({ storage: storage }).single("profile"));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", questionRoutes);
app.use("/api/post", answerRoutes);

// model relations

// M:M Question and Tag
Question.belongsToMany(Tag, { through: "QuestionTag" });
Tag.belongsToMany(Question, { through: "QuestionTag" });

// Tagid | QUestionId

// 1:M Question and Answer
Answer.belongsTo(Question);
Question.hasMany(Answer);

// 1:M User and Answer
Answer.belongsTo(User);
User.hasMany(Answer);

// 1:M User and Question
Question.belongsTo(User);
User.hasMany(Question);

//Server connection
const port = process.env.PORT || 8000; // PORT

// syncing the models with the database and server running
sequelize.sync().then((result) => {
  client
    .info()
    .then((response) => {
      app.listen(port, () => {
        console.log(`app is runnning at ${port}`);
      });
      console.log(response);
    })
    .catch((error) => console.error(error));
});
