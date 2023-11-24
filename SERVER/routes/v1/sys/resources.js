// routes/userRoutes.js
const express = require('express');
const resourcesController = require('../../../controllers/v1/sys/resourcesController');

const router = express.Router();

// 获取所有资源
router.post('/list', resourcesController.getAll);
// 创建资源
router.post('/create', resourcesController.create);
// 更新资源
router.post('/update', resourcesController.update);
// 删除资源
router.post('/delete', resourcesController.delete);

module.exports = router;
