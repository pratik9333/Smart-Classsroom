const multer = require("multer");

//multer setting
exports.storage = (path) => {
  console.log(path);
  multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(req, file, cb);
      cb(null, `./public/${path}`);
    },
    filename: function (req, file, cb) {
      console.log(req, file, cb);
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
};

// upload handlers
const uploadStorageHandlers = {

  profileStorage: storage('images',
    (file) => file.fieldname + "-" + Date.now() + path.extname(file.originalname)),

  assignmentStorage: storage('assignments',
    (file) => {
      const ext = file.mimetype.split("/")[1];
      return `assignment-${file.originalname}.${ext}`
    }),

  responseStorage: storage('responses',
    (file) => {
      const ext = file.mimetype.split("/")[1];
      return `response-${file.originalname}.${ext}`
    })

}

// multer upload 
exports.profileUpload = multer({ storage: uploadStorageHandlers.profileStorage });
exports.assignmentUpload = multer({ storage: uploadStorageHandlers.assignmentStorage });
exports.responseUpload = multer({ storage: uploadStorageHandlers.responseStorage });
