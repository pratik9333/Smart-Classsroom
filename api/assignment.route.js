const router = require("express").Router();

const { isAuth } = require("../middlewares/auth.middleware");
const {
  createAssignment,
  updateAssignment,
} = require("../services/assignment.service");

// create assignment
router.post("/create/:classId", isAuth, createAssignment);

//update assignment
router.put("/update/:classId/:assignmentId", isAuth, updateAssignment);

module.exports = router;
