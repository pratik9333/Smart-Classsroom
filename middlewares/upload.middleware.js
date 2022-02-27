const multer = require("multer");

//multer setting
exports.storage = (path) => multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/${path}`);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
