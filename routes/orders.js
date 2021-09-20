const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/',orderController.getOrders);
//router.get('/:orderId',orderController.oneOrder);
router.post('/',orderController.createOrder);
router.put("/:orderId",orderController.modifyOrder);
router.get("/:orderId",orderController.oneOrder);
router.delete("/:orderId",orderController.deleteOrder);
router.delete("/",orderController.deleteAllOrders);

module.exports = router;
