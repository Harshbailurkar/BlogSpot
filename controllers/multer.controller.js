import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const FileName = Date.now() + "-" + file.originalname;
    cb(null, FileName);
  },
});

export default storage;
