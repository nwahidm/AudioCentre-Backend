const multer = require("multer");
const path = require("path");
const { v4: uuidv } = require("uuid");

const multerMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, files, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, files, cb) => {
      cb(null, uuidv() + path.extname(files.originalname));
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

module.exports = multerMiddleware;
