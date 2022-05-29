const User = require("../models/user.model");
const Question = require("../models/post/question.model");
const Answer = require("../models/post/answer.model");
const Tag = require("../models/post/tag.model");
const Class = require("../models/class.model");
const {
  Assignment,
  Response,
} = require("../models/assignment/assignment.model");

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

  // N:M User and Class
  Class.belongsToMany(User, { through: "ClassUser" });
  User.belongsToMany(Class, { through: "ClassUser" });

  // 1:M Assignment and Response
  Response.belongsTo(Assignment);
  Assignment.hasMany(Response);

  // 1:M Assignment and Class
  Class.hasMany(Assignment);
  Assignment.belongsTo(Class);

  // 1:M User and Response
  Response.belongsTo(User);
  User.hasMany(Response);
};
