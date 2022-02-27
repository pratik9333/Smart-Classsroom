const router = require("express").Router();
const { check } = require("express-validator");

const { signup, signin } = require("../services/auth.service");

//Routes

/**
 * @route POST /api/auth/signup
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
  ],
  signup
);

/**
 * @route POST /api/auth/signin
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
