const { validationResult } = require("express-validator");

const User = require("../models/user.model");
const Tag = require("../models/tag.model");
const Question = require("../models/question.model");
const client = require("../config/elastic");

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
      const x = await client.index({
        index: "smart-classroom",
        id: question.id,
        body: req.body,
      });
      await client.indices.refresh({ index: "smart-classroom" });
      console.log(x);

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

exports.editQuestion = async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByPk(req.userId);
  const question = await Question.findByPk(id);
  const checkquestion = await user.hasQuestion(question);

  if (checkquestion && question) {
    const result = await question.update(req.body);
    console.log(result);
    await client.update({
      index: "smart-classroom",
      id,
      body: {
        doc: req.body,
      },
    });
    res.status(200).json({ success: "Question Updated" });
  } else {
    res.status(401).json({ error: "Question not found" });
  }
};

exports.deleteQuestion = async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByPk(req.userId);
  const question = await Question.findByPk(id);
  const checkquestion = await user.hasQuestion(question);

  if (checkquestion && question) {
    await question.destroy();
    await client.delete({
      index: "smart-classroom",
      id,
    });
    res.status(200).json({ success: "Question deleted" });
  } else {
    res.status(401).json({ error: "Question not found" });
  }
};

exports.searchQuestionsByTags = async (req, res, next) => {
  //  questions/?filterTags=tag1,tag2
  let filterTags = req.query.filterTags;

  const filteredQuestions = {};

  if (filterTags && filterTags.trim().length > 0) {
    filterTags = filterTags.split(",");

    for (const tagName of filterTags) {
      if (tagName !== "") {
        const tag = await Tag.findOne({ where: { name: tagName } });
        let questions = [];
        if (tag) {
          const numQuestions = await tag.countQuestions();
          if (numQuestions > 0) {
            questions = await tag.getQuestions();
            questions = questions.map((question) => ({
              id: question.id,
              heading: question.heading,
              description: question.description,
            }));
          }
          filteredQuestions[tagName] = questions;
        }
      }
    }

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
