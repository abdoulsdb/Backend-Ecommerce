const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController')
const multer = require('multer');
const upload = multer ({dest :'public/images'});

router.get('/',productController.getProduct);
router.post('/', upload.single('productImage'),productController.createProduct);
router.put("/:productId",upload.single('productImage'),productController.modifyProduct);
router.get("/:productId",productController.oneProduct);
router.delete("/:productId",productController.deleteProduct);

module.exports = router;
