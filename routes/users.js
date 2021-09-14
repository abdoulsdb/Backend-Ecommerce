const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/',userController.getUser);
router.get('/:userId',userController.oneUser);
router.post('/',userController.createUser);
router.put("/:userId",userController.modifyUser);
router.delete("/:userId",userController.deleteUser);
router.delete("/",userController.deleteAllUsers);

module.exports = router;
