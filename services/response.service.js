const { AssignmentResponse, Assignment } = require("../models/Assignment/assignment.model")
const  Class = require("../models/class.model");
const User = require("../models/user.model");

exports.getResponse = (req, res) => { }
exports.getAllResponses = (req, res) => { }
exports.createResponse = async(req, res) => {
    try {
        const { classCode, assignmentId, description } = req.body;
        if(!classCode || !assignmentId || !description){
            return res.status(400).json({message: 'Please provide all the fields'})
        }
        const cls = await Class.findOne({ where: { classCode } });
        if (!cls) {
            return res
                .status(400)
                .json({ error: "Invalid classcode or class does not exists anymore" });
        }
        const assignment = await Assignment.findByPk(assignmentId);

        if (!assignment) {
            return res
                .status(400)
                .json({ error: " Invalid assignment details or no such Assignment exists." });
        }
        const loggedInUser = await User.findByPk(req.userId);


        const assignmentResponse = await loggedInUser.createResponse({
            description,
            attachments: req.file ? req.file.path : null
        });

        await assignment.addResponse(assignmentResponse);

        return res.status(200).json({
            message: `Response created`,
            assignmentResponse,
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "unable to create response" });
    }
}
exports.updateResponse = (req, res) => { }
exports.deleteResponse = (req, res) => { }

