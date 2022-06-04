const router = require("express").Router();

const {
  createClass,
  removeUserFromClass,
  removeClass,
  getClassDetails,
} = require("../services/class.service");

const { isAuth } = require("../middlewares/auth.middleware");
const { checkTeacherRole } = require("../middlewares/checkRole.middleware");

// create class
router.post("/", isAuth, checkTeacherRole, createClass);

// remove user from class
router.delete("/remove/user", isAuth, checkTeacherRole, removeUserFromClass);

// remove class
router.delete("/remove", isAuth, checkTeacherRole, removeClass);

// get class details
router.get("/members", isAuth, getClassDetails);

module.exports = router;
