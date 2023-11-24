const multer = require('multer');
const path = require('path');
const fs = require('fs');


function createFolder(folderPath) {
    const folders = folderPath.split(path.sep);
    let currentPath = '';

    folders.forEach((folder) => {
        currentPath = path.join(currentPath, folder);
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
        }
    });
}

/*
* JPEG 图像：
文件扩展名：.jpg、.jpeg
MIME 类型：image/jpeg
*
PNG 图像：
文件扩展名：.png
MIME 类型：image/png
*
GIF 图像：
文件扩展名：.gif
MIME 类型：image/gif
*
BMP 图像：
文件扩展名：.bmp
MIME 类型：image/bmp
*
TIFF 图像：
文件扩展名：.tiff、.tif
MIME 类型：image/tiff
*
WebP 图像：
文件扩展名：.webp
MIME 类型：image/webp
*
SVG 图像：
文件扩展名：.svg
MIME 类型：image/svg+xml
*
ICO 图标：
文件扩展名：.ico
MIME 类型：image/x-icon
* */



/**
 * 文件上传中间件
 * @param {string} uploadPath - 文件存放的目标文件夹名称 主目录上 例如 uploads
 * @param {string} fieldName - 上传文件的字段名 默认值：file 通过req.file取到
 * @param {array} allowedFileTypes - 允许上传的图片类型
 * @returns {Function} - Express 中间件函数
 * TODO: 使用示例：uploadMiddleware('uploads') uploads是存放文件夹名称
 */
function uploadMiddleware(uploadPath, fieldName = 'file',allowedFileTypes = []) {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            let destination;
            if (file.mimetype.startsWith('image/') && file.mimetype !== 'image/svg+xml') {
                destination = path.join(uploadPath, 'images');
            } else if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
                destination = path.join(uploadPath, 'media');
            } else {
                destination = path.join(uploadPath, 'files');
            }

            if (allowedFileTypes.length > 0 && !allowedFileTypes.includes(file.mimetype)) {
                return cb(new Error('该文件类型不允许上传：'+file.mimetype), null);
            }

            createFolder(destination);
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            const extension = path.extname(file.originalname);
            const newFilename = `${timestamp}${extension}`;
            cb(null, newFilename);
        }
    });

    const upload = multer({storage});

    return upload.single(fieldName);
}

/**
 * 多文件上传中间件
 * @param {string} uploadPath - 文件上传的目标路径
 * @param {array} fieldNames - 上传文件的字段名 默认值：files 通过req.files取到  files 是数组
 * @returns {Function} - Express 中间件函数
 */
function uploadArrayMiddleware(uploadPath, fieldNames = ['files']) {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            let destination;
            if (file.mimetype.startsWith('image/') && file.mimetype !== 'image/svg+xml') {
                destination = path.join(uploadPath, 'images', Date.now().toString());
            } else if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
                destination = path.join(uploadPath, 'media', Date.now().toString());
            } else {
                destination = path.join(uploadPath, 'files', Date.now().toString());
            }
            createFolder(destination);
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            const extension = path.extname(file.originalname);
            const newFilename = `${timestamp}${extension}`;
            cb(null, newFilename);
        }
    });

    const upload = multer({ storage });

    // 使用 upload.array，支持多个文件
    return upload.array(fieldNames);
}

module.exports = { uploadMiddleware,uploadArrayMiddleware };


