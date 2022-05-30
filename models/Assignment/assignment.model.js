const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

exports.Assignment = sequelize.define(
  "assignment",
  {
    subjectName: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(90),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.STRING(10000),
      allowNull: true,
    },
  },
  { timestamps: true }
);

exports.Response = sequelize.define(
  "response",
  {
    description: {
      type: DataTypes.STRING(4000),
      allowNull: true,
    },
    attachments: {
      type: DataTypes.STRING(10000),
      allowNull: false,
    },
  },
  { timestamps: true }
);
