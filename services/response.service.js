const { AssignmentResponse, Assignment } = require("../models/Assignment/assignment.model")
const  Class = require("../models/class.model");
const User = require("../models/user.model");
const fs = require("fs");

exports.getResponse = (req, res) => { 
    try{
        return res.status(200).json({ success: true, response: req.body.data.assignmentResponse });
    }catch(error){
        res.status(500).json({ error: "unable to fetch assignments" });
    }
}

exports.getAllResponses = async(req, res) => {
    try{
        const assignment = req.body.data.assignment;
        const allResponses = await assignment.getResponses();
        return res.status(200).json({ success: true, responses: allResponses });
    }catch(error){
        res.status(500).json({ error: "unable to fetch assignments" });
    }
}

exports.createResponse = async(req, res) => {
    try {
        
        const loggedInUser = req.body.data.loggedUser;
        const assignment = req.body.data.assignment;
        if(!req.file){
            return res.status(400).json({error: 'Please submit the attachment'})
        }
        const description = req.body.description;
        const assignmentResponse = await loggedInUser.createResponse({
            description,
            attachments:  `${req.protocol}://${req.get("host")}/` + req.file.path
        });

        await assignment.addResponse(assignmentResponse);

        return res.status(200).json({
            message: `Response created for Assignment ${assignment.id}`,
            assignmentResponse,
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "unable to create response" });
    }
}
exports.updateResponse = async(req, res) => { 

    try{
        const assignmentResponse = req.body.data.assignmentResponse;

        if(_deleteFileIfExists(req,assignmentResponse,'attachments','responses',true)){
            req.body.attachments =  `${req.protocol}://${req.get("host")}/` + req.file.path; 
        }

        await assignmentResponse.update(req.body);

        return res.status(200).json({message: 'Response updated'});
    }catch(error){
        console.log(error.message)
        res.status(500).json({error: 'Unable to update response'});
    }
    
}

exports.deleteResponse = async(req, res) => { 

    try{
        const assignmentResponse = req.body.data.assignmentResponse;
        
        req.file ={ filename: assignmentResponse.attachments};
        
        _deleteFileIfExists(req,assignmentResponse,'attachments','responses',false);
        
        await assignmentResponse.destroy();

        return res.status(200).json({message: 'Response deleted'});
    }catch(error){
        console.log(error.message)
        res.status(500).json({error: 'Unable to delete response'});
    }

}



_deleteFileIfExists = (req, entity,fileProp,pathDir,checkOld) => {
    if (req.file) {
      if (entity[fileProp]) {
        const oldFileName = entity[fileProp].split("/")[5];
        const newFileName = req.file.filename.split("/")[1];

        let path = `./public/attachments/${pathDir}/${oldFileName}`;
  
        if (oldFileName !== newFileName || !checkOld) {
          if (fs.existsSync(path)) {
            fs.unlinkSync(path);
            return true;
          }
        }
      }
    }
    return false;
};


exports.postCreateResponseCheck = async(req,res,next) => {

    const { responseId } = req.body;
    if(!responseId ){
        return res.status(400).json({message: 'Please provide all details'})
    }
    const assignmentResponse = await AssignmentResponse.findByPk(responseId);
    if(!assignmentResponse){
        res.status(400).json({error: 'Invalid response id'})
    }
    const loggedInUser = req.body.data.loggedUser;
    const assignment = req.body.data.assignment;

    const allowed = await Promise.all([
                            assignment.hasResponse(assignmentResponse), 
                            loggedInUser.hasResponse(assignmentResponse)])

    if(!allowed.every(Boolean)){
        return res.status(400).json({message:'Unauthorized Access'})
    }
    req.body.data.assignmentResponse = assignmentResponse;
    next();
}


exports.preCreateResponseCheck = async(req,res,next) => {

    const { classCode, assignmentId } = req.body;
    if(!classCode || !assignmentId ){
        return res.status(400).json({message: 'Please provide all details'})
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
    
    const allowed = await cls.hasAssignment(assignment)

    if(!allowed){
        return res.status(400).json({message:'Unauthorized Access'});
    }
    req.body.data = {}
    req.body.data.assignment = assignment;
    req.body.data.cls = cls;
    req.body.data.loggedUser = loggedInUser;
    next();
}