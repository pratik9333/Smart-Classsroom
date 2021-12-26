const { validationResult } = require("express-validator");

const User = require("../models/user.model");
const Tag = require("../models/tag.model");
const Question = require("../models/question.model");

exports.getPost = async (req, res, next) => {
  const id = req.params.id;

  const question = await Question.findByPk(id);

  if (!question) {
    return res.status(400).json({ error: "Cannot able to find question" });
  } else {
    const answers = await question.getAnswers();
    const tags = await question.getTags();

    const postObj = {
      heading: question.heading,
      description: question.description,
      answers: answers
        ? answers.map((answer) => ({
            id: answer.id,
            description: answer.description,
          }))
        : [],

      tags: tags
        ? tags.map((tag) => ({
            id: tag.id,
            name: tag.name,
          }))
        : [],
    };

    return res.status(200).json({ post: postObj });
  }
};

exports.createQuestion = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const { heading, description, tags } = req.body;

  const user = await User.findOne({ where: { id: req.userId } });

  if (!user) {
    return res.status(400).json({ error: "No Such User" });
  } else {
    const question = await user.createQuestion({
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
  }
};

exports.editQuestion = (req, res, next) => {};

exports.deleteQuestion = (req, res, next) => {};

exports.searchQuestionsByTags = (req, res, next) => {
  //  questions/?filterTags=tag1,tag2
  let filterTags = req.query.filterTags;

  const filteredQuestions = {};

  if (filterTags && filterTags.trim().length() > 0) {
    // filterTags= ['tag1','tag2']
    filterTags = filterTags.split(",");

    filterTags.forEach((tagName) => {
      if (tagName !== "") {
        const tag = await Tag.findOne({ where: { name: tagName } });

        if (tag) {
          const questions =
            tag.countQuestions() > 0
              ? tag.getQuestions().map((question) => ({
                  id: question.id,
                  heading: question.heading,
                  description: question.description,
                }))
              : [];

          filteredQuestions[tagName] = questions;
        }
      }
    });

    return res.status(200).json({
      filteredQuestions,
    });
  }
};

exports.getRecentQuestions = (req, res, next) => {};

//private function to create tag / add tag

_createRelatedTagsIfNotExists = (question, tags) => {
  // check if the tag with that name exists or not.
  try {
    tags.forEach(async (tagName) => {
      if (tagName !== "") {
        const tag = await Tag.findOne({ where: { name: tagName } });

        // if tag is not present, then create
        if (!tag) {
          await question.createTag({ name: tagName });
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
