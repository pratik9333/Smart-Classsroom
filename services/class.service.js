//const Class = require("../models/class.model");
const User = require("../models/user.model");

exports.createClass = async (req, res) => {
  try {
    const { classname, classsection } = req.body;
    const user = await User.findByPk(req.userId);

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not allowded to access this resource" });
    }

    const createdClass = await user.createClass({
      name: classname,
      section: classsection,
    });

    return res.status(200).json({ success: true, createdClass });
  } catch (error) {
    return res.status(500).json({ error: "Error while creating class" });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { username, useremail, userpassword, classid } = req.body;

    if (!username || !useremail || !userpassword) {
      return res.status(400).json({ error: "Please provide all user details" });
    }

    const getClass = await Class.findByPk(classid);

    await getClass.createUser({
      fullname: username,
      email: useremail,
      password: userpassword,
    });

    return res.status(200).json({ success: true, message: "User added" });
  } catch (error) {
    return res.status(500).json({ error: "Error while adding user" });
  }
};

exports.addBulkStudent = async (req, res) => {
  try {
  } catch (error) {}
};
