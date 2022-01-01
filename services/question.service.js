const { validationResult } = require("express-validator");

const User = require("../models/user.model");
const Tag = require("../models/tag.model");
const Question = require("../models/question.model");
const client = require("../config/elastic");

exports.getPost = async (req, res) => {
  try {
    const id = req.params.id;

    const postObj = await client.get({
      index: "smart-classroom",
      id,
    });

    return res.status(200).json({ post: postObj.body._source });
  } catch (error) {
    res.status(400).json({ error: "No Post Found" });
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
      await client.index({
        index: "smart-classroom",
        id: question.id,
        body: req.body,
      });
      await client.indices.refresh({ index: "smart-classroom" });

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
    await question.update(req.body);
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
  try {
    let filterTags = req.query.filterTags;
    const tags = filterTags.split(",").join(" ");
    const { body } = await client.search({
      index: "smart-classroom",
      body: {
        query: {
          match: { tags: tags },
        },
      },
    });
    res.status(200).json(
      body.hits.hits.map((hit) => ({
        id: hit._id,
        post: hit._source,
      }))
    );
  } catch (error) {
    res.status(400).json({ error: "No Posts found" });
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
    return false;
  }
  return true;
};
