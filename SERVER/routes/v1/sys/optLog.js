// routes/userRoutes.js
const express = require('express');
const userOptLogController = require('../../../controllers/v1/sys/userOptLogController');

const router = express.Router();

// 获取所有操作日志
router.post('/list', userOptLogController.getAll);
// 创建操作日志
router.post('/create', userOptLogController.create);
// 获取指定操作日志
router.post('/findOne', userOptLogController.findOne);
// 更新操作日志
router.post('/update', userOptLogController.update);
// 删除操作日志
router.post('/delete', userOptLogController.delete);

module.exports = router;
