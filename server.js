const express = require("express");
const multer = require("multer");
const path = require("path");
const client = require("./config/elastic");

const { storage } = require("./middlewares/upload.middleware");

// db models
const sequelize = require("./config/db");

// routes
const authRoutes = require("./api/auth.route");
const userRoutes = require("./api/user.route");
const questionRoutes = require("./api/question.route");
const answerRoutes = require("./api/answer.route");
const assignmentRoutes = require("./api/assignment.route");

const app = express();

//serve images statically
app.use("/public", express.static(path.join(__dirname, "public")));

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// file upload middleware
const imageUploader = multer({ storage: storage("images") });
const fileUploader = multer({ storage: storage("assignments") });

//Routes
app.use("/api/auth", imageUploader.single("profile"), authRoutes);
app.use("/api/user", imageUploader.single("profile"), userRoutes);
app.use("/api/assignment", fileUploader.single("assignment"), assignmentRoutes);
app.use("/api/post", questionRoutes);
app.use("/api/post", answerRoutes);

//Server connection
const port = process.env.PORT || 8000; // PORT

require("./Relations").Relations(); // Relations

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
