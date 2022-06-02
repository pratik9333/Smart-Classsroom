const User = require("../models/user.model");
const Question = require("../models/post/question.model");
const Answer = require("../models/post/answer.model");
const Tag = require("../models/post/tag.model");
const Class = require("../models/class.model");
const {
  Assignment,
  AssignmentResponse,
} = require("../models/Assignment/assignment.model");

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

  // 1:M Assignment and AssignmentResponse
  AssignmentResponse.belongsTo(Assignment);
  Assignment.hasMany(AssignmentResponse);

  // 1:M Assignment and Class
  Assignment.belongsTo(Class);
  Class.hasMany(Assignment);

  // 1:M Assignment and User
  Assignment.belongsTo(User);
  User.hasMany(Assignment);

  // 1:M User and AssignmentResponse
  AssignmentResponse.belongsTo(User);
  User.hasMany(AssignmentResponse);
};
