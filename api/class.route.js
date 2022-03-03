const router = require("express").Router();

const {
  createClass,
  addUser,
  addBulkStudent,
  // removeClass,
  // removeUser,
  // getClassDetails,
} = require("../services/class.service");

const { isAuth } = require("../middlewares/auth.middleware");

// create class
router.post("/", isAuth, createClass);

// add user - manually
router.post("/member", isAuth, addUser);

// add students - bulk
router.post("/members/bulk", isAuth, addBulkStudent);

// // remove class
// router.delete("/", isAuth, removeClass);

// // remove user from class
// router.delete("/member", isAuth, removeUser);

// // get class details
// router.get("/members", isAuth, getClassDetails);

module.exports = router;
