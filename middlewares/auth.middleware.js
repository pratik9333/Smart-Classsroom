require("dotenv").config({ path: __dirname + "./config/.env" });
const jwt = require("jsonwebtoken");

exports.isAuth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decodedPayload = jwt.verify(token, process.env.SECRET);
      req.userId = decodedPayload._id;
      next();
    } else {
      return res.status(400).json({ message: "Please provide the token" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ err, message: "token invalid or expired, please try again" });
  }
};
