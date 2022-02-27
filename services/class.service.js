const Class = require("../models/class.model");
const User = require("../models/user.model");

const readXlsxFile = require("read-excel-file");
const uuidV4 = require("uuid").v4();

const sendMail = require("../utils/sendMail");

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


    const user = await User.findByPk(req.userId);

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not allowded to access this resource" });
    }

    const {classId,xlsMapping} = req.body; 
    
    const path = `/public/student/${classId}.xlsx`;

    const users = [];

    const receivers = []; 

    await readXlsxFile(fs.createReadStream(path),{ xlsMapping } ,(eachUser)=>{

      const newUser = await User.create({ ...eachUser,password: uuidV4() })
      users.push(newUser);
      receivers.push({ email: eachUser.email,password: uuidV4(),fullName: eachUser.fullName });
    })

    const getClass = await Class.findByPk(classid);

    await getClass.addUsers(users);

    // send email to users
    const emailPromises = await Promise.all(sendMail('senderName', 'senderEmail', 'senderPass', receivers,'',{user}));
    console.log(emailPromises);


    return res.status(200).json({ success: true,message: "User created successfully." });

  } catch (error) {

    console.log(error);
    return res.status(500).json({ error: "Error while creating user" });

  }
};


