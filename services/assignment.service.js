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

exports.updateAssignment = async (req, res) => {
  try {
    const { assignmentId, classId } = req.params;
    const { subjectName, description, dueDate } = req.body;

    let flag = 0;

    if (!assignmentId) {
      return res.status(400).json({ error: "Please provide assignment ID" });
    }

    if (!subjectName || !description || !dueDate) {
      return res.status(400).json({ error: "Please provide all the fields" });
    }

    const assignment = await Assignment.findByPk(assignmentId);
    const cls = await Class.findOne({ where: { classCode: classId } });

    if (cls.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid class Id or class does not exists anymore" });
    }

    if (!assignment) {
      return res.status(400).json({ error: "Assignment does not exists" });
    }

    const clsAssignments = await cls.getAssignments();

    for (let assign of clsAssignments) {
      if (assign.id == assignmentId) {
        flag = 1;
        break;
      }
    }

    if (flag === 0) {
      return res
        .status(400)
        .json({ error: "Assignment does not belong to this class" });
    }

    if (req.file) {
      // checking if existing assignment has attachments
      if (assignment.attachments) {
        let path = "./public/attachments/";

        // getting attachment file name
        const assignmentFileName = assignment.attachments.split("/")[5];

        // checking if sending file name is same as saved file name in attachments directory
        if (req.file.filename.split("/")[1] !== assignmentFileName) {
          // reading all files from our attachments directory
          fs.readdir(path, (err, files) => {
            if (err) throw err;

            // looping through all files from directory
            files.forEach((file) => {
              if (file === assignmentFileName) {
                fs.unlinkSync(path + file); // deleting file if filename matches
              }
            });
          });
        }
      }
      req.body.attachments =
        `${req.protocol}://${req.get("host")}/` + req.file.path;
    }

    if (req.body.points) {
      req.body.points = parseInt(req.body.points);
    }

    // updating assignment
    const updatedAssignment = await assignment.update(req.body);

    res.status(200).json({
      message: `Assignment updated`,
      updatedAssignment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable to update assignment" });
  }
};
