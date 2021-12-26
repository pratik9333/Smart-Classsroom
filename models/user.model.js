const crypto = require("crypto");

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class User extends Model {
  // utility fn to validate password
  validatePassword(inputPassword) {
    let hash = crypto
      .pbkdf2Sync(inputPassword, this.salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return this.password === hash;
  }
}

User.init(
  {
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    rollno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    dob: {
      type: DataTypes.STRING,
    },

    classname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    gender: {
      type: DataTypes.ENUM,
      values: ["female", "male", "Other"],
    },

    role: {
      type: DataTypes.ENUM,
      values: ["teacher", "student"],
      allowNull: false,
      defaultValue: "student",
    },

    profile: {
      type: DataTypes.STRING,
      defaultValue: "/public/images/defaultimage.jpeg",
    },
    salt: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true, sequelize }
);

// before create , hash the password
User.beforeCreate((user, options) => {
  // generate a unique secret
  user.salt = crypto.randomBytes(16).toString("hex");
  // Hashing user's salt and password with 1000 iterations,
  user.password = crypto
    .pbkdf2Sync(user.password, user.salt, 1000, 64, `sha512`)
    .toString(`hex`);
});

// exporting User model
module.exports = User;
