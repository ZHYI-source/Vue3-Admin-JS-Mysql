const {userModel,resourcesModel} = require('@models/v1');
const {body, param, validationResult} = require('express-validator');
const apiResponse = require('@utils/utils.apiResponse')
const {actionRecords} = require("@middlewares/actionLogMiddleware");
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const {checkApiPermission, checkUserRole} = require("@middlewares/authMiddleware");
const { deleteFile, findFile} = require('@utils/utils.files')
const path = require('path')
const {Op} = require('sequelize');

resourcesModel.belongsTo(userModel, {
    foreignKey: 'userId',
    as: 'user',
});
/**
 * 获取所有资源
 * @route POST /v1/sys/resources/list
 * @group 资源管理 - 资源相关
 * @returns {object} 200 - 成功返回资源列表
 * @returns {Error}  default - 错误响应
 */
exports.getAll = [
    tokenAuthentication,
    checkApiPermission('sys:resources:list'),
    async (req, res, next) => {
        try {
            // 从请求中获取分页、排序和查询参数
            let query = req.body;
            let params = query.params || {};
            let current = Number(query.pagination?.current || 1) || 1;
            let pageSize = Number(query.pagination?.pageSize || 15) || 15;
            let sortColumn = query.sort?.columnKey || 'createdAt';
            let sortOrder = query.sort?.order === 'ascend' ? 'ASC' : 'DESC';

            // 构建查询条件
            let whereConditions = {};
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    whereConditions[key] = { [Op.like]: `%${params[key]}%` };
                }
            }

            let sequelizeOptions = {
                where: whereConditions,
                order: [[sortColumn, sortOrder]],
                offset: (current - 1) * pageSize,
                limit: pageSize,
                include: [{
                    model: userModel,
                    as: 'user',
                    attributes: ['id', 'nickname']
                }]
            };

            let result = await resourcesModel.findAll(sequelizeOptions);
            let total = await resourcesModel.count(sequelizeOptions);

            return apiResponse.successResponseWithData(res, "Success.", {
                result,
                current,
                pageSize,
                total
            })
        } catch (err) {
            next(err);
        }
    }
];


/**
 * 创建资源
 * @route POST /v1/sys/resources/create
 * @group 资源管理 - 资源相关
 * @param {string} srcName.required - 资源名
 * @param {string} srcType.required - 类型
 * @returns {object} 200 - 资源创建成功
 * @returns {Error}  default - 错误响应
 * TODO 实际不需要这个接口  创建资源数据已经在上传文件接口添加了 作为权限使用
 */
exports.create = [
    tokenAuthentication,
    checkApiPermission('sys:resources:create'),
    body("srcName").notEmpty().withMessage('资源名称不能为空.'),
    body("srcType").notEmpty().withMessage('资源类型不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            }
            // 创建新资源
            const newResources = {
                ...req.body
            };
            newResources.userId = req.userId
            const newUser = await resourcesModel.create(newResources);
            return apiResponse.successResponse(res, "资源创建成功.");
        } catch (err) {
            next(err);
        }
    }
];



/**
 * 更新资源
 * @route POST /v1/sys/resources/update
 * @group 资源管理 - 资源相关
 * @param {number} id.required - 资源ID
 * @returns {object} 200 - 资源更新成功
 * @returns {Error}  default - 错误响应
 */
exports.update = [
    tokenAuthentication,
    checkApiPermission('sys:resources:update'),
    body("id").notEmpty().withMessage('资源ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            }

            const resourcesId = req.body.id;

            const resourcesInfo = await resourcesModel.findByPk(resourcesId);
            if (!resourcesInfo) {
                return apiResponse.notFoundResponse(res, "资源不存在.");
            }

            await resourcesInfo.update({...req.body});

            return apiResponse.successResponse(res, "资源更新成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 删除资源
 * @route POST /v1/sys/resources/delete
 * @group 资源管理 - 资源相关
 * @param {number} id.required - 资源ID
 * @returns {object} 200 - 资源删除成功
 * @returns {Error}  default - 错误响应
 */
exports.delete = [
    tokenAuthentication,
    checkApiPermission('sys:resources:delete'),
    body("id").notEmpty().withMessage('资源ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const {srcName, srcType} = req.body;
            const resourcesId = req.body.id;
            const resources = await resourcesModel.findByPk(resourcesId);
            if (!resources) {
                return apiResponse.notFoundResponse(res, "资源不存在.");
            }
            let fileFullPath;
            if (srcType.startsWith('image/') && srcType !== 'image/svg+xml') {
                fileFullPath = path.join(process.cwd(), 'uploads/images', srcName);
            } else if (srcType.startsWith('video/')) {
                fileFullPath = path.join(process.cwd(), 'uploads/media', srcName);
            } else {
                fileFullPath = path.join(process.cwd(), 'uploads/files', srcName);
            }
            await findFile(fileFullPath);
            await deleteFile(fileFullPath);

            await resources.destroy();

            return apiResponse.successResponse(res, "资源删除成功.");
        } catch (err) {
            next(err);
        }
    }
];

