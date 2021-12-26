const router = require("express").Router();
const { body } = require("express-validator");

const {
  getPost,
  createQuestion,
  editQuestion,
  deleteQuestion,
  searchQuestionsByTag,
  getRecentQuestions,
} = require("../services/question.service");

const { isAuth } = require("../middlewares/auth.middleware");

// search questions by tag
router.get("/questions", searchQuestionsByTag);

// get recent questions
router.get("/questions", getRecentQuestions);

// get a question
router.get("/questions/:id", getPost);

// create question
router.post(
  "/questions",
  [
    body(
      "heading",
      "Length of heading should be minimum five characters"
    ).isLength({ min: 5 }),
    body(
      "description",
      "Length of description should be minimum five characters"
    ).isLength({ min: 5 }),
  ],
  isAuth,
  createQuestion
);

// edit a question
router.put("/questions/:id", isAuth, editQuestion);

// delete a question
router.delete("/questions/:id", isAuth, deleteQuestion);

module.exports = router;
