const { validationResult } = require("express-validator");

const Question = require("../models/question.model");
const Tag = require("../models/tag.model");

exports.getAQuestion = (req, res, next) => {};

exports.createQuestion = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const { heading, description, tags } = req.body;

  const question = await Question.create({
    heading,
    description,
  });
  const isSuccess = await _createRelatedTagsIfNotExists(question, tags);

  if (isSuccess) {
    return res.status(201).json({
      id: question.id,
      message: "question created",
    });
  } else {
    return res.status(500).json({
      error: "Some error occured",
    });
  }
};

exports.editQuestion = (req, res, next) => {};

exports.deleteQuestion = (req, res, next) => {};

exports.searchQuestionsByTag = (req, res, next) => {};

exports.getRecentQuestions = (req, res, next) => {};




_createRelatedTagsIfNotExists = async (question, tags) => {
  // check if the tag with that name exists or not.
  try {
    tags.forEach((tag) => {
      if (tag !== "") {
        const tag = await Tag.findOne({ where: { name: tag } });

        // if tag is not present, then create
        if (!tag) {
          await question.createTag({ name: tag });
        } else {
          // if present, then link to that question
         await question.addTag(tag);
        }
      }
    });
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};
