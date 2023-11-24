// routes/userRoutes.js
const express = require('express');
const permissionsController = require('../../../controllers/v1/sys/permissionsController');

const router = express.Router();

// 获取所有权限
router.post('/list', permissionsController.getAll);
// 创建权限
router.post('/create', permissionsController.create);
// 获取指定权限
router.post('/findOne', permissionsController.findOne);
// 更新权限
router.post('/update', permissionsController.update);
// 删除权限
router.post('/delete', permissionsController.delete);
// 停用权限
router.post('/stop', permissionsController.stop);
// 权限树
router.post('/tree', permissionsController.tree);

module.exports = router;
