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
const classRoutes = require("./api/class.route");

const app = express();

//serve images statically
app.use("/public", express.static(path.join(__dirname, "public")));

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configuration for multer

//multer setting
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `public`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(
      null,
      `attachments/assignment-${file.originalname}-${Date.now()}.${ext}`
    );
  },
});

const upload = multer({ storage: multerStorage });
//Routes
app.use("/api/auth", upload.single("profile"), authRoutes);
app.use("/api/user", upload.single("profile"), userRoutes);
app.use("/api/assignment", upload.single("attachment"), assignmentRoutes);
app.use("/api/post", questionRoutes, answerRoutes);
app.use("/api/class", upload.single("studentsData"), classRoutes);

//Server connection
const port = process.env.PORT || 8000;

// importing Relations
require("./utils/relations").Relations();

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
