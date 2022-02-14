const User = require("./models/user.model");
const Question = require("./models/Post/question.model");
const Answer = require("./models/Post/answer.model");
const Tag = require("./models/Post/tag.model");

exports.Relations = () => {
  // model relations : POST
  // M:M Question and Tag
  Question.belongsToMany(Tag, { through: "QuestionTag" });
  Tag.belongsToMany(Question, { through: "QuestionTag" });

  // 1:M Question and Answer
  Answer.belongsTo(Question);
  Question.hasMany(Answer);

  // 1:M User and Answer
  Answer.belongsTo(User);
  User.hasMany(Answer);

  // 1:M User and Question
  Question.belongsTo(User);
  User.hasMany(Question);
};
