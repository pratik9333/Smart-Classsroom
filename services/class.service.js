const Class = require("../models/class.model");
const User = require("../models/user.model");

exports.createClass = async (req, res) => {
  try {
    const { classname, classsection } = req.body;
    console.log(req.body);

    if (!classname || !classsection) {
      return res
        .status(400)
        .json({ error: "Please provide class name and section" });
    }

    const user = await User.findByPk(req.userId);

    const createdClass = await user.createClass({
      name: classname,
      section: classsection,
    });

    return res.status(200).json({ success: true, createdClass });
  } catch (error) {
    return res.status(500).json({ error: "Error while creating class" });
  }
};

exports.removeUserFromClass = async (req, res) => {
  try {
    const { classCode, userId } = req.body;

    if (!classCode || !userId) {
      return res
        .status(400)
        .json({ error: "Please provide class code and userID" });
    }

    const loggedUser = await User.findByPk(req.userId);
    const removeUser = await User.findByPk(userId);

    if (removeUser.role === "teacher") {
      return res
        .status(400)
        .json({ error: "Cannot able to remove teacher from class" });
    }

    const cls = await Class.findOne({ where: { classCode: classCode } });

    // check if class users belongs to the this class
    const UserClass = await removeUser.getClass().name;
    const teacherClass = await loggedUser.getClass().name;

    if (UserClass !== cls.name || teacherClass !== cls.name) {
      return res.status(400).json({
        error: `You or ${removeUser.fullname} does not belong to this class`,
      });
    }

    // removing user created responses
    await removeUser.removeResponses();

    // removing user from class as requested by teacher
    await cls.removeUser(removeUser);

    return res.status(200).json({ success: "User was removed from class" });
  } catch (error) {
    return res.status(500).json({ error: "Error while removing user" });
  }
};

exports.removeClass = async (req, res) => {
  try {
    const { classCode } = req.body;

    if (!classCode) {
      return res.status(400).json({ error: "Please provide class code" });
    }

    const cls = await Class.findOne({ where: { classCode: classCode } });
    const loggedUser = await User.findByPk(req.userId);

    const teacherClass = await loggedUser.getClass().name;

    // check if class teacher belongs to the this class
    if (teacherClass !== cls.name) {
      return res.status(400).json({
        error: `${loggedUser.fullname} does not belong to this class`,
      });
    }

    const assignments = await cls.getAssignments();

    // removing particular responses of assignment
    for (let assignment of assignments) {
      await assignment.removeResponses();
    }

    // removing assignments of class
    await cls.removeAssignments();

    // removing class
    await cls.destroy();

    return res.status(500).json({ success: `Class ${cls.name} was removed` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error while removing class" });
  }
};

exports.getClassDetails = async (req, res) => {
  try {
    const { classCode } = req.body;

    if (!classCode) {
      return res.status(400).json({ error: "Please provide class code" });
    }

    const cls = await Class.findOne({ where: { classCode: classCode } });

    if (!cls) {
      return res
        .status(400)
        .json({ error: "Invalid class code or class does not exists anymore" });
    }

    const classMembers = await cls.getUsers();

    return res.status(200).json({ success: true, classMembers });
  } catch (error) {
    return res.status(500).json({ error: "Error while getting class members" });
  }
};
