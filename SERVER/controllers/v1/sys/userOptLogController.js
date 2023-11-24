const {userOptLogModel} = require('@models/v1');
const {body, validationResult} = require('express-validator');
const apiResponse = require('@utils/utils.apiResponse')
const {Op} = require('sequelize');
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const {checkApiPermission, checkUserRole} = require("@middlewares/authMiddleware");
/**
 * 获取所有操作日志
 * @route POST /v1/sys/optLog/list
 * @group 操作日志管理 - 操作日志相关
 * @returns {object} 200 - 成功返回操作日志列表
 * @returns {Error}  default - 错误响应
 */
exports.getAll = [
    tokenAuthentication,
    checkApiPermission('sys:optLog:list'),
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
                    whereConditions[key] = {[Op.like]: `%${params[key]}%`};
                }
            }
            // 查询数据库获取整张表的总记录数
            const totalCount = await userOptLogModel.count();
            // 查询数据库
            const optInfo = await userOptLogModel.findAll({
                where: whereConditions,
                order: [[sortColumn, sortOrder]],
                offset: (current - 1) * pageSize,
                limit: pageSize,
            });
            return apiResponse.successResponseWithData(res, "Success.", {
                result: optInfo,
                current,
                pageSize,
                total: totalCount
            })
        } catch (err) {
            next(err);
        }
    }
];


/**
 * 创建操作日志
 * @route POST /v1/sys/optLog/create
 * @group 操作日志管理 - 操作日志相关
 * @param {string} username.required - 操作日志名
 * @param {string} password.required - 密码
 * @returns {object} 200 - 操作日志创建成功
 * @returns {Error}  default - 错误响应
 */
exports.create = [
    tokenAuthentication,
    checkApiPermission('sys:optLog:create'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            // 创建新操作日志
            await userOptLogModel.create({...req.body});
            return apiResponse.successResponse(res, "操作日志创建成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 获取单个操作日志
 * @route POST /v1/sys/optLog/findOne
 * @group 操作日志管理 - 操作日志相关
 * @param {number} id.required - 操作日志ID
 * @returns {object} 200 - 成功返回单个操作日志
 * @returns {Error}  default - 错误响应
 */

exports.findOne = [
    tokenAuthentication,
    checkApiPermission('sys:optLog:findOne'),
    body("id").notEmpty().withMessage('操作日志ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const optId = req.body.id;
            const optInfo = await userOptLogModel.findByPk(optId);

            if (!optInfo) {
                return apiResponse.notFoundResponse(res, "操作日志不存在.");
            }

            return apiResponse.successResponseWithData(res, "Success.", optInfo);
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 更新操作日志
 * @route POST /v1/sys/optLog/update
 * @group 操作日志管理 - 操作日志相关
 * @param {number} id.required - 操作日志ID
 * @returns {object} 200 - 操作日志更新成功
 * @returns {Error}  default - 错误响应
 */
exports.update = [
    tokenAuthentication,
    checkApiPermission('sys:optLog:update'),
    body("id").notEmpty().withMessage('操作日志ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const optId = req.body.id;

            const optInfo = await userOptLogModel.findByPk(optId);
            if (!optInfo) {
                return apiResponse.notFoundResponse(res, "操作日志不存在.");
            }

            await optInfo.update({...req.body});

            return apiResponse.successResponse(res, "操作日志更新成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 删除操作日志
 * @route POST /v1/sys/optLog/delete
 * @group 操作日志管理 - 操作日志相关
 * @param {number} id.required - 操作日志ID
 * @returns {object} 200 - 操作日志删除成功
 * @returns {Error}  default - 错误响应
 */
exports.delete = [
    tokenAuthentication,
    checkApiPermission('sys:optLog:delete'),
    body("id").notEmpty().withMessage('操作日志ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const optId = req.body.id;

            const optInfo = await userOptLogModel.findByPk(optId);
            if (!optInfo) {
                return apiResponse.notFoundResponse(res, "操作日志不存在.");
            }

            await optInfo.destroy();

            return apiResponse.successResponse(res, "操作日志删除成功.");
        } catch (err) {
            next(err);
        }
    }
];
