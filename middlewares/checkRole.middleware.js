const User = require("../models/user.model");

exports.checkTeacherRole = async (req, res) => {
    const loggedUser = await User.findByPk(req.userId);

    if (loggedUser.role !== "teacher") {
        return res
        .status(400)
        .json({ error: "Unauthorized access" });
    }
};

exports.checkAdminRole = async (req, res) => {
    const loggedUser = await User.findByPk(req.userId);

    if (loggedUser.role !== "admin") {
        return res
        .status(400)
        .json({ error: "Unauthorized access" });
    }
};
