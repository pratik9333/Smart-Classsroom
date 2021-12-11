const multer = require("multer");
const path = require("path");
require("dotenv").config({ path: __dirname + "./config/.env" });
const User = require("../models/user.model");
const { storage } = require("../server");

//get profile
exports.getProfile = (req, res) => {
  User.findOne({ where: { id: req.userId } })
    .then((user) => {
      if (!user) {
        return res.json({ failed: "Failed to get profile details" });
      } else {
        const {
          fullname,
          email,
          rollno,
          dob,
          classname,
          gender,
          role,
          profile,
        } = user;

        res.json({
          user: {
            fullname,
            email,
            rollno,
            dob,
            classname,
            gender,
            role,
            profile,
          },
        });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

//update profile
exports.updateProfile = (req, res, next) => {
  updateprofile = {};

  if (req.body.fullname) updateprofile.fullname = req.body.fullname;
  if (req.body.email) updateprofile.email = req.body.email;
  if (req.body.rollno) updateprofile.rollno = req.body.rollno;
  if (req.body.dob) updateprofile.dob = req.body.dob;
  if (req.body.classname) updateprofile.classname = req.body.classname;
  if (req.body.gender) updateprofile.gender = req.body.gender;
  if (req.body.role) updateprofile.role = req.body.role;

  User.findOne({ where: { id: req.userId } }).then((user) => {
    if (!user) {
      return res.json({ error: "No User Found" });
    } else {
      user
        .update(updateprofile)
        .then((user) => {
          return res.json({ success: "user profile updated!" });
        })
        .catch((err) => {
          return res.json({ err: err });
        });
    }
  });
};
