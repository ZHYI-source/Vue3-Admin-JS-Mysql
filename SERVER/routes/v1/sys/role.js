// routes/userRoutes.js
const express = require('express');
const roleController = require('../../../controllers/v1/sys/roleController');

const router = express.Router();

// 获取所有角色
router.post('/list', roleController.getAll);
// 创建角色
router.post('/create', roleController.create);
// 获取指定角色
router.post('/findOne', roleController.findOne);
// 更新角色
router.post('/update', roleController.update);
// 删除角色
router.post('/delete', roleController.delete);

// 角色分配权限
router.post('/assignAuthority', roleController.assignAuthority);

module.exports = router;
