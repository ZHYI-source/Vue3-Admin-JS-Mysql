// routes/userRoutes.js
const express = require('express');
const userController = require('../../../controllers/v1/sys/userController');

const router = express.Router();

// 获取所有用户
router.post('/list', userController.getAllUsers);
// 创建用户
router.post('/create', userController.createUser);
// 获取指定用户
router.post('/findOne', userController.findOneUser);
// 更新用户
router.post('/update', userController.updateUser);
// 删除用户
router.post('/delete', userController.deleteUser);


module.exports = router;
