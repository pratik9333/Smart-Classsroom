const router = require("express").Router();

const { isAuth } = require("../middlewares/auth.middleware");
const { checkTeacherRole } = require("../middlewares/checkRole.middleware");
const {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getClassAssignments,
} = require("../services/assignment.service");

// create assignment
router.post("/create/:classId", isAuth, checkTeacherRole, createAssignment);

//update assignment
router.put(
  "/update/:classId/:assignmentId",
  isAuth,
  checkTeacherRole,
  updateAssignment
);

//delete assignment
router.delete(
  "/delete/:classId/:assignmentId",
  isAuth,
  checkTeacherRole,
  deleteAssignment
);

//get class assignments
router.get("/:classId", isAuth, getClassAssignments);

module.exports = router;
