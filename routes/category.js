const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const multer = require('multer');

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
 dest :'public/images',
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
router.get('/',categoryController.getCategory);
router.get('/:categoryId',categoryController.oneCategory);
router.post('/',upload.single('categoryImage'),categoryController.createCategory);
router.put("/:categoryId",upload.single('categoryImage'),categoryController.modifyCategory);
router.delete("/:categoryId",categoryController.deleteCategory);
router.delete("/",categoryController.deleteAllCategory);

module.exports = router;
