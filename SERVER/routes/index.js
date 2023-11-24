// routes/index.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

// 递归加载所有路由文件
function loadRoutes(dir, prefix = '') {
    fs.readdirSync(dir)
        .forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                // 如果是目录，则递归加载子目录中的路由文件
                const folderPrefix = `${prefix}/${file}`;
                loadRoutes(filePath, folderPrefix);
            } else if (file !== 'index.js') {
                // 排除当前文件，并加载路由
                const route = require(filePath);
                // 所有路由都以文件名或者文件夹开头 http://localhost:3000/v1/user
                router.use(`${prefix}/${file.replace('.js', '')}`, route);
            }
        });
}

// 从当前目录开始加载路由
loadRoutes(__dirname);

module.exports = router;
