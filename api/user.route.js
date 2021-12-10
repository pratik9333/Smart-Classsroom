const router = require("express").Router();

const { isAuth } = require("../middlewares/auth.middleware");

const { getProfile, updateProfile } = require("../services/user.service");

/**
 * @route GET /profile/
 * @visibility protected
 *
 */
router.get("/user/profile", isAuth, getProfile);

/**
 * @route PUT /profile/
 * @visibility protected
 *
 */
router.put("/user/profile", isAuth, updateProfile);

module.exports = router;
