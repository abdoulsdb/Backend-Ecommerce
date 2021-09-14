const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const multer = require('multer');
const upload = multer ({dest :'public/images'});

router.get('/',categoryController.getCategory);
router.get('/:categoryId',categoryController.oneCategory);
router.post('/', upload.single('categoryImage'),categoryController.createCategory);
router.put("/:categoryId",upload.single('categoryImage'),categoryController.modifyCategory);
router.delete("/:categoryId",categoryController.deleteCategory);
router.delete("/",categoryController.deleteAllCategory);

module.exports = router;
