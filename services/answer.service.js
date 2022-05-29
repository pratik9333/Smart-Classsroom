const { validationResult } = require("express-validator");

// const User = require("../models/user.model");
const Answer = require("../models/post/answer.model");
const Question = require("../models/post/question.model");
const client = require("../config/elastic");
const User = require("../models/user.model");

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

    const createdAnswer = await question.createAnswer({
      UserId: req.userId,
      description,
    });

    await client.update({
      index: "smart-classroom",
      id: questionId,
      body: {
        script: {
          source: "ctx._source.answers.add(params.answer)",
          params: {
            answer: [createdAnswer.id.toString(), description],
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

exports.editAnswer = async (req, res) => {
  const { description } = req.body;

  const { ansid, queid } = req.params;

  try {
    const answer = await Answer.findByPk(ansid);
    const user = await User.findByPk(req.userId);

    if (user && answer) {
      const hasAnswer = await user.hasAnswer(answer);

      if (!hasAnswer) {
        return res
          .status(401)
          .json({ error: "User is not allowed to edit the answer" });
      }
    }

    await answer.update(description);
    const post = await client.get({
      index: "smart-classroom",
      id: queid,
    });
    let answers = post.body._source.answers;

    let answerMap = new Map(answers);

    answerMap.set(`${ansid}`, description);

    let updatedAnswer = [...answerMap.entries()];

    await client.update({
      index: "smart-classroom",
      id: queid,
      body: {
        doc: {
          answers: updatedAnswer,
        },
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Answer updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Server error" });
  }
};

exports.deleteAnswer = async (req, res) => {
  const { ansid, queid } = req.params;

  try {
    const answer = await Answer.findByPk(ansid);
    const user = await User.findByPk(req.userId);
    const hasAnswer = await user.hasAnswer(answer);

    if (!user || !answer || !hasAnswer) {
      return res
        .status(401)
        .json({ error: "User is not allowed to delete the answer" });
    }

    await answer.destroy();

    const post = await client.get({
      index: "smart-classroom",
      id: queid,
    });
    let answers = post.body._source.answers;

    let answerMap = new Map(answers);

    answerMap.delete(`${ansid}`);

    let updatedAnswer = [...answerMap.entries()];

    await client.update({
      index: "smart-classroom",
      id: queid,
      body: {
        doc: {
          answers: updatedAnswer,
        },
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "Answer deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Server Error" });
  }
};
