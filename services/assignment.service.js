const Class = require("../models/class.model");
const User = require("../models/user.model");
const Assignment = require("../models/assignment/assignment.model");

exports.createAssignment = async (req, res) => {
  try {
    const { subjectName, dueDate } = req.body;

    const { classId } = req.params;

    if (!subjectName || !dueDate || !classId) {
      return res.status(400).json({ error: "please provide all fields" });
    }

    const loggedUser = await User.findByPk(req.userId);
    const cls = await Class.findOne({ where: { classCode: classId } });

    if (!cls) {
      return res
        .status(400)
        .json({ error: "Invalid classcode or class does not exists anymore" });
    }

    if (loggedUser.role !== "teacher") {
      return res
        .status(400)
        .json({ error: "Assignment can only create by the teacher of class" });
    }

    req.body.createdBy = loggedUser.id;
    req.body.points = parseInt(req.body.points);

    if (req.file) {
      req.body.attachments =
        `${req.protocol}://${req.get("host")}/` + req.file.path;
    }

    const createdAssignment = await cls.createAssignment(req.body);

    res.status(200).json({
      message: `Assignment of ${req.body.subjectName} was created`,
      createdAssignment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable to create assignment" });
  }
};
