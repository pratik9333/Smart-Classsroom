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

  User.create(req.body)
    .then((response) => {
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
        error: "Email and password does not match",
      });
    }

    // CREATE TOKEN
    const token = jwt.sign({ _id: user.id }, process.env.SECRET,{
      expiresIn: 36000
    });

    const {
      id,
      fullname,
      profile,
      email,
      classname,
      rollno,
      gender,
      dob,
      role,
    } = user;

    res.json({
      token,
      user: {
        id,
        fullname,
        email,
        profile,
        classname,
        rollno,
        gender,
        dob,
        role,
      },
    });
  });
};
