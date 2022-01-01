require("dotenv").config({ path: __dirname + "./config/.env" });
const User = require("../models/user.model");

//get profile
exports.getProfile = (req, res) => {
  User.findOne({ where: { id: req.userId } })
    .then((user) => {
      if (!user) {
        return res.json({ error: "Failed to get profile details" });
      } else {
        const {
          fullname,
          email,
          rollno,
          dob,
          classname,
          gender,
          role,
          profile,
        } = user;

        res.json({
          user: {
            fullname,
            email,
            rollno,
            dob,
            classname,
            gender,
            role,
            profile,
          },
        });
      }
    })
    .catch((err) => {
      res.json({ error: "Not able to get profile" });
    });
};

//update profile
exports.updateProfile = (req, res, next) => {
  const updateprofile = {};

  if (req.body.fullname) updateprofile.fullname = req.body.fullname;
  if (req.body.email) updateprofile.email = req.body.email;
  if (req.body.rollno) updateprofile.rollno = req.body.rollno;
  if (req.body.dob) updateprofile.dob = req.body.dob;
  if (req.body.classname) updateprofile.classname = req.body.classname;
  if (req.body.gender) updateprofile.gender = req.body.gender;
  if (req.body.role) updateprofile.role = req.body.role;
  if (req.file) updateprofile.profile = req.file.path;

  User.findOne({ where: { id: req.userId } }).then((user) => {
    if (!user) {
      return res.status(400).json({ error: "No User Found" });
    } else {
      user
        .update(updateprofile)
        .then((user) => {
          return res.status(200).json({ success: "user profile updated!" });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ error: "Not able to update profile" });
        });
    }
  });
};

exports.getUserQuestions = async (req, res) => {
  try {
    // find the user by id
    const user = await User.findByPk(req.userId);
    // qna response to return
    const qnaResponses = [];
    // if user is present
    if (user) {
      // get all questions of that user
      const questions = await user.getQuestions();
      // if questions are there
      if (questions) {
        const eachQnaResponse = {};
        // for each question, prepare question.id =>{ question details, answer details,tags}
        for (const question of questions) {
          const tags = await question.getTags();
          const answers = await question.getAnswers();

          eachQnaResponse[question.id] = {
            description: question.description,
            heading: question.heading,
            answers: answers.map((answer) => ({
              description: answer.description,
              created_by: answer.userId
            })),
            tags: tags.map((tag) => tag.name),
          };
          qnaResponses.push(eachQnaResponse);
        }
      }

      res.status(200).json({
        message: "success",
        data: qnaResponses,
      });
    }

    res.status(401).json({ error: "No such user" });
  } catch (error) {
    res.status(500).json({
      error: "Interal Server Error",
    });
  }
};
