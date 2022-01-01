const router = require("express").Router();

const { isAuth } = require("../middlewares/auth.middleware");

const {
  getProfile,
  updateProfile,
  getUserQuestions,
} = require("../services/user.service");

// get user questions
router.get("/questions", isAuth, getUserQuestions);

router.get("/profile", isAuth, getProfile);

router.put("/profile", isAuth, updateProfile);

module.exports = router;
