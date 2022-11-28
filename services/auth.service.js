require("dotenv").config({ path: __dirname + "./config/.env" });

const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user.model");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  if (req.file) req.body.profile = req.file.path;

  User.create(req.body)
    .then((response) => {
      req.body.profile = null;
      return res.json({ message: "Signup Successfull" });
    })
    .catch((err) => {
      return res.json({ message: err });
    });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  //find user with email

  User.findOne({ where: { email: email } }).then((user) => {
    if (!user) {
      return res.json({ message: "User Not Found" });
    }

    if (!user.validatePassword(password)) {
      return res.status(401).json({
        error: "password does not match",
      });
    }

    // CREATE TOKEN
    const token = jwt.sign({ _id: user.id }, process.env.SECRET, {
      expiresIn: 36000,
    });

    res.json({ success: "signin success", token: { token } });
  });
};
