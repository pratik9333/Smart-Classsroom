const Class = require("../models/class.model");
const User = require("../models/user.model");
const Assignment = require("../models/assignment/assignment.model");

exports.createAssignment = async (req, res) => {
  try {
    const { name, dueDate, classCode } = req.body;

    if (!name || !dueDate || !classCode) {
      return res.status(400).json({ error: "please provide all fields" });
    }

    const loggedUser = await User.findByPk(req.userId);
    const cls = await Class.findOne({ where: { classCode } });

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

    if (req.file) {
      req.body.attachments =
        `${req.protocol}://${req.get("host")}/` + req.file.path;
    }
    console.log(typeof loggedUser.id);

    const assignment = {
      name,
      description: req.body.description
        ? req.body.description
        : "no description",
      createdBy: loggedUser.id,
      dueDate,
      points: req.body.points ? req.body.points : 0,
      attachments: req.file
        ? `${req.protocol}://${req.get("host")}/${req.file.path}`
        : "no attachments",
    };

    const createdAssignment = await cls.createAssignment(assignment);

    res.status(200).json({
      message: `Assignment of ${req.name} was created`,
      createdAssignment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "unable to create assignment" });
  }
};
