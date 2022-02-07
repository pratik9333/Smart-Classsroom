const router = require("express").Router();
const { body } = require("express-validator");

const {
  createAnswer,
  editAnswer,
  deleteAnswer,
} = require("../services/answer.service");

const { isAuth } = require("../middlewares/auth.middleware");

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

// edit a question
router.put("/question/:queid/answer/:ansid", isAuth, editAnswer);

// delete a question
router.delete("/question/:queid/answer/:ansid", isAuth, deleteAnswer);

module.exports = router;
