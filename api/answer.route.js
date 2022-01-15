const router = require("express").Router();
const { body } = require("express-validator");

const { createAnswer } = require("../services/answer.service");

const { isAuth } = require("../middlewares/auth.middleware");

// // search questions by tag
// router.get("/questions", searchQuestionsByTags);

// // get recent questions
// router.get("/topquestions", getRecentQuestions);

// // get a question
// router.get("/questions/:id", getPost);

// create question
router.post(
  "/answer",
  [
    body(
      "description",
      "Length of description should be minimum five characters"
    ).isLength({ min: 5 }),
  ],
  isAuth,
  createAnswer
);

// // edit a question
// router.put("/questions/:id", isAuth, editQuestion);

// // delete a question
// router.delete("/questions/:id", isAuth, deleteQuestion);

module.exports = router;
