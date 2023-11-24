const tokenAuthentication = require('@middlewares/tokenAuthentication')
const apiResponse = require('@utils/utils.apiResponse')
const {uploadMiddleware} = require("@middlewares/uploadMiddleware")
const {downloadFile, deleteFile, findFile} = require('@utils/utils.files')
const {resourcesModel} = require('@models/v1')
const path = require('path')
const {URL, PORT} = process.env;
const URL_PREFIX = `${URL}:${PORT}/v1/common/files`;


// 将字节数转换为可读性更好的文件大小表示
function formatFileSize(bytes) {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const fileSize = (bytes / Math.pow(1024, i)).toFixed(2);
    return `${fileSize} ${sizes[i]}`;
}


/**
 * 图片上传
 * @route POST /v1/common/files/upload/img
 * @group 上传下载 - 上传下载相关
 * @returns {Error}  default - Unexpected error
 * @security JWT   需要token
 */

exports.upload = [
    tokenAuthentication,
    uploadMiddleware('uploads'),
    async (req, res) => {
        try {
            if (!req.file) return apiResponse.ErrorResponse(res, '没有上传文件');
            // 获取图片信息
            const file = req.file;
            const filename = file.filename;
            let previewUrl = null;
            let downloadUrl = `${URL_PREFIX}/download/files/${filename}`;
            // let deleteUrl = `${URL_PREFIX}/delete/files/${filename}`;
            if (file.mimetype.startsWith('image/') && file.mimetype !== 'image/svg+xml') {
                previewUrl = `${URL_PREFIX}/preview/img/${filename}`;
                downloadUrl = `${URL_PREFIX}/download/img/${filename}`;
                // deleteUrl = `${URL_PREFIX}/delete/img/${filename}`;
            } else if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
                previewUrl = `${URL_PREFIX}/preview/media/${filename}`;
                downloadUrl = `${URL_PREFIX}/download/media/${filename}`;
                // deleteUrl = `${URL_PREFIX}/delete/media/${filename}`;
            }
            // 入库记录
            const newResources = {
                srcName:filename,
                srcSize:formatFileSize(file.size),
                srcType:file.mimetype,
                previewPath:previewUrl,
                downloadPath:downloadUrl,
                // deletePath:deleteUrl,
            };
            newResources.userId = req.userId

            await resourcesModel.create(newResources);

            // 返回成功响应
            return apiResponse.successResponseWithData(res, '上传成功', {filename, previewUrl, downloadUrl});
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }]

/**
 * 图片预览
 * @route POST /v1/common/files/preview/img:filename
 * @group 上传下载 - 上传下载相关
 * @returns {Error}  default - Unexpected error
 */
async function handlePreview(filePath, type, req, res) {
    try {
        const filename = req.params.filename;
        const fileFullPath = path.join(process.cwd(), filePath, filename);
        res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(filename)}"`);
        // 根据实际图片类型调整 Content-Type
        res.setHeader('Content-Type', type);
        res.sendFile(fileFullPath, (err) => {
            if (err) {
                console.error('预览出错', err);
            }
        });
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
}


async function handleDownload(filePath, req, res) {
    try {
        const filename = req.params.filename;
        const fileFullPath = path.join(process.cwd(), filePath, filename);
        return await downloadFile(fileFullPath, filename, res)
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
}

async function handleDelete(filePath, req, res) {
    try {
        const filename = req.params.filename;
        const fileFullPath = path.join(process.cwd(), filePath, filename);
        await findFile(fileFullPath)
        await deleteFile(fileFullPath)
        return apiResponse.successResponse(res, '删除成功！')
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
}

/**
 *  预览媒体
 *  previewMedia.
 * @returns {Object}
 */
exports.previewMedia = [
    async (req, res) => {
        await handlePreview(
            'uploads/media',
            'video/mp4,audio/mpeg',
            req,
            res)
    }
]
/**
 * 图片预览
 * @route POST /v1/common/files/preview/img:filename
 * @group 上传下载 - 上传下载相关
 * @returns {Error}  default - Unexpected error
 */
exports.previewImg = [
    async (req, res) => {
        await handlePreview(
            'uploads/images',
            'image/jpeg,image/png',
            req,
            res)
    }
]


/**
 *  下载图片
 *  downloadImg.
 * @returns {Object}
 */
exports.downloadImg = [
    async (req, res) => {
        await handleDownload('uploads/images', req, res)
    }
]

/**
 *  下载视频
 *  downloadMedia.
 * @returns {Object}
 */
exports.downloadMedia = [
    async (req, res) => {
        await handleDownload('uploads/media', req, res)
    }
]

/**
 *  下载其他文件
 *  downloadFile.
 * @returns {Object}
 */
exports.downloadFile = [
    async (req, res) => {
        await handleDownload('uploads/files', req, res)
    }
]

/**
 *  删除图片
 *  deleteImg.
 * @returns {Object}
 */
exports.deleteImg = [
    async (req, res) => {
        await handleDelete('uploads/images', req, res)
    }
]

/**
 *  删除视频
 *  deleteMedia.
 * @returns {Object}
 */
exports.deleteMedia = [
    async (req, res) => {
        await handleDelete('uploads/Media', req, res)
    }
]
/**
 *  删除文件
 *  deleteFiles.
 * @returns {Object}
 */
exports.deleteFiles = [
    async (req, res) => {
        await handleDelete('uploads/files', req, res)
    }
]
