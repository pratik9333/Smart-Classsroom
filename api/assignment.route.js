const router = require("express").Router();

const { isAuth } = require("../middlewares/auth.middleware");
const {
  createAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../services/assignment.service");

// create assignment
router.post("/create/:classId", isAuth, createAssignment);

//update assignment
router.put("/update/:classId/:assignmentId", isAuth, updateAssignment);

//delete assignment
router.delete("/delete/:classId/:assignmentId", isAuth, deleteAssignment);

module.exports = router;
