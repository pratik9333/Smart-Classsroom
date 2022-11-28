const Class = require("../models/class.model");
const User = require("../models/user.model");
const { Assignment } = require("../models/assignment/assignment.model");
const fs = require("fs");

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

    req.body.points = parseInt(req.body.points);

    if (req.file) {
      req.body.attachments =
        `${req.protocol}://${req.get("host")}/` + req.file.path;
    }

    const createdAssignment = await loggedUser.createAssignment(req.body);

    // setting up class relation with assignment
    await cls.addAssignment(createdAssignment);
    createdAssignment.classId = cls.id;
    res.status(200).json({
      message: `Assignment of ${req.body.subjectName} was created`,
      createdAssignment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable to create assignment" });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { assignmentId, classId } = req.params;
    const { subjectName, description, dueDate } = req.body;

    const assignment = await Assignment.findByPk(assignmentId);
    const loggedUser = await User.findByPk(req.userId);
    const cls = await Class.findOne({
      where: { classCode: classId },
      raw: false,
    });

    if (!subjectName || !description || !dueDate) {
      return res.status(400).json({ error: "Please provide all the fields" });
    }

    if (!cls) {
      return res
        .status(400)
        .json({ error: "Invalid class Id or class does not exists anymore" });
    }

    if (!assignment) {
      return res.status(400).json({ error: "Assignment does not exists" });
    }

    const result = await _findAssignment(assignment, req.userId);

    if (!result) {
      return res.status(400).json({
        error: `This assignment does not belong to ${loggedUser.fullname}`,
      });
    }

    if (_deleteFileIfExists(req, assignment)) {
      req.body.attachments =
        `${req.protocol}://${req.get("host")}/` + req.file.path;
    }

    if (req.body.points) {
      req.body.points = parseInt(req.body.points);
    }

    // updating assignment
    const updatedAssignment = await assignment.update(req.body);

    res.status(200).json({
      message: `Assignment of ${updatedAssignment.subjectName} was updated`,
      updatedAssignment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable to update assignment" });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { assignmentId, classId } = req.params;

    const assignment = await Assignment.findByPk(assignmentId);
    const loggedUser = await User.findByPk(req.userId);
    const cls = await Class.findOne({ where: { classCode: classId } });

    const Users = await assignment.getUser();

    console.log(Users);

    if (!assignmentId || !classId) {
      return res
        .status(400)
        .json({ error: "Please provide assignment and class ID" });
    }

    if (!assignment) {
      return res.status(400).json({ error: "Assignment does not exists" });
    }

    if (!cls) {
      return res
        .status(400)
        .json({ error: "Invalid class Id or class does not exists anymore" });
    }

    const result = await _findAssignment(assignment, req.userId);

    if (!result) {
      return res.status(400).json({
        error: `This assignment does not belong to ${loggedUser.fullname}`,
      });
    }

    _deleteFileIfExists(req, assignment);

    // deleting assignment
    await assignment.destroy();

    res.status(200).json({
      success: true,
      message: `Assignment deleted`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable to delete assignment" });
  }
};

exports.getClassAssignments = async (req, res) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({ error: "Please provide class ID" });
    }

    const cls = await Class.findOne({ where: { classCode: classId } });

    if (!cls) {
      return res
        .status(400)
        .json({ error: "Invalid class code or class does not exists" });
    }

    const clsAssignments = await cls.getAssignments();

    return res.status(200).json({ success: true, clsAssignments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable to fetch assignments" });
  }
};

// Private functions
_findAssignment = async (assignment, userId) => {
  const Users = await assignment.getUsers();

  for (let user of Users) {
    if (user.id == userId) {
      return true;
    }
  }
  return false;
};

_deleteFileIfExists = (req, assignment) => {
  if (req.file) {
    // checking if existing assignment has attachments
    if (assignment.attachments) {
      const assignmentFileName = assignment.attachments.split("/")[5];
      let path = `./public/attachments/assignments/${assignmentFileName}`;

      if (req.file.filename.split("/")[1] !== assignmentFileName) {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
          return true;
        }
      }
    }
  }
};
