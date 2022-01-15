const { validationResult } = require("express-validator");
var format = require("date-format");

// const User = require("../models/user.model");
// const Answer = require("../models/answer.model");
const Question = require("../models/question.model");
const client = require("../config/elastic");

exports.createAnswer = async (req, res) => {
  const { questionId, description } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  try {
    const question = await Question.findByPk(questionId);

    if (!question) {
      res.status(401).json({ error: "Question not found" });
    }

    const createdAnswer = await question.createAnswer({ description });

    await client.update({
      index: "smart-classroom",
      id: questionId,
      body: {
        script: {
          source: "ctx._source.answers.add(params.answer)",
          params: {
            answer: { id: createdAnswer.id, description },
          },
        },
      },
    });

    res.status(200).json({ success: "Answer created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Cannot able to create answer" });
  }
};
