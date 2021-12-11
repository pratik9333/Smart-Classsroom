const express = require("express");
const multer = require("multer");
const path = require("path");
const { storage } = require("./middlewares/upload.middleware");

const app = express();

//serve images statically
app.use("/public", express.static(path.join(__dirname, "public")));

// routes
const authRoutes = require("./api/auth.route");
const userRoutes = require("./api/user.route");

const sequelize = require("./config/db");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage: storage }).single("profile"));

//Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

//Server connection
const port = process.env.PORT || 8000; // PORT

//multer setting
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// syncing the models with the database and server running
sequelize.sync().then((result) => {
  app.listen(port, () => {
    console.log(`app is runnning at ${port}`);
  });
});
