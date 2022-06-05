const multer = require("multer");

//multer setting
const storage = (path, filePathResolver) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,
        `./public/${path}`);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        filePathResolver(file)
      );
    },
  });
};

// upload handlers
const uploadStorageHandlers = {

  profileStorage: storage('images',
    (file) => file.fieldname + "-" + Date.now() + path.extname(file.originalname)),

  assignmentStorage: storage('attachments/assignments',
    (file) => {
      const ext = file.mimetype.split("/")[1];
      return `assignment-${file.originalname}.${ext}`
    }),

  responseStorage: storage('attachments/responses',
    (file) => {
      const ext = file.mimetype.split("/")[1];
      return `response-${file.originalname}.${ext}`
    })

}

// multer upload 
exports.profileUpload = multer({ storage: uploadStorageHandlers.profileStorage });
exports.assignmentUpload = multer({ storage: uploadStorageHandlers.assignmentStorage });