const router = require("express").Router();

const { isAuth } = require("../middlewares/auth.middleware");

const { getProfile, updateProfile } = require("../services/user.service");

/**
 * @route GET /profile/
 * @visibility protected
 *
 */
router.get("/profile", isAuth, getProfile);

/**
 * @route PUT /profile/
 * @visibility protected
 *
 */
router.put("/profile", isAuth, updateProfile);





module.exports = router;
