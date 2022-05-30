const router = require("express").Router();

const { isAuth } = require("../middlewares/auth.middleware");
const { createAssignment } = require("../services/assignment.service");

// create assignment by teacher
router.post("/create/:classId", isAuth, createAssignment);

module.exports = router;
