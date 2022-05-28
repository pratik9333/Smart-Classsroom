const router = require("express").Router();

const { isAuth } = require("../middlewares/auth.middleware");

const {
  getProfile,
  updateProfile,
  getUserQuestions,
  joinClass,
} = require("../services/user.service");

// get user questions
router.get("/questions", isAuth, getUserQuestions);

// get user profile
router.get("/profile", isAuth, getProfile);

// update user profile
router.put("/profile", isAuth, updateProfile);

// join classroom
router.post("/join/class", isAuth, joinClass);

module.exports = router;
