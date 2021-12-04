const crypto = require("crypto");

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class User extends Model {

  // utility fn to validate password
  validatePassword(inputPassword) {
    let hash = crypto.pbkdf2Sync(inputPassword,
      this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.password === hash;
  }

}

// defining the User Schema
User.init(
  {
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    rollno: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    dob: {
      type: DataTypes.DATE,
    },

    classname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    gender: {
      type: DataTypes.ENUM,
      values: ["Female", "Male", "Other"],
    },

    profile: {
      type: DataTypes.STRING,
      defaultValue: "/public/image/defaultimage.jpeg",
    },
    salt: {
      type: DataTypes.STRING
    }
  },
  { timestamps: true, sequelize }
);

// before create , hash the password
User.beforeCreate((user, options) => {
   // generate a unique secret 
   user.salt = crypto.randomBytes(16).toString('hex');
   // Hashing user's salt and password with 1000 iterations, 
   user.password = crypto.pbkdf2Sync(user.password, user.salt,
     1000, 64, `sha512`).toString(`hex`);
});



// exporting User model
module.exports = User;
