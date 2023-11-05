const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      
      cb(null, 'public/assets/images/category');
    },
    filename: function (req, file, cb) {
      const fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    }
  });

  module.exports = {
    uploadCategory: multer({ storage: storage })
  }