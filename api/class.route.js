const router = require("express").Router();

const {
  createClass,
  removeUserFromClass,
  removeClass,
  getClassDetails,
} = require("../services/class.service");

const { isAuth } = require("../middlewares/auth.middleware");

// create class
router.post("/", isAuth, createClass);

// remove user from class
router.delete("/remove/user", isAuth, removeUserFromClass);

// remove class
router.delete("/remove", isAuth, removeClass);

// get class details
router.get("/members", isAuth, getClassDetails);

module.exports = router;
