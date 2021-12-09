const router = require("express").Router();
const { check } = require("express-validator");

const { signup, signin } = require("../services/auth.service");

//Routes

/**
 * @route POST /api/signup
 * @visibility public
 * 
 */
router.post(
  "/signup",
  [
    check("fullname", "fullname should be atleast 3 char!").isLength({
      min: 3,
    }),

    check("email", "Email is not correct!").isEmail(),

    check("password", "Password should be atleast 6 characters").isLength({
      min: 6,
    }),

    check("classname", "Classname should be atleast 3 characters").isLength({
      min: 3,
    }),
  ],
  signup
);

/**
 * @route POST /api/signin
 * @visibility public
 * 
 */
router.post(
  "/signin",
  [
    check("email", "Email is not correct!").isEmail(),

    check("password", "Password should be atleast 6 characters").isLength({
      min: 6,
    }),
  ],
  signin
);

module.exports = router;
