// controllers/userController.js
const {userModel} = require('@models/v1');
const {body, param, validationResult} = require('express-validator');
const apiResponse = require('@utils/utils.apiResponse')
const {actionRecords} = require("@middlewares/actionLogMiddleware");
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const {checkApiPermission, checkUserRole} = require("@middlewares/authMiddleware");
const {Op} = require('sequelize');
/**
 * 获取所有用户
 * @route POST /v1/sys/user/list
 * @group 用户管理 - 用户相关
 * @returns {object} 200 - 成功返回用户列表
 * @returns {Error}  default - 错误响应
 */
exports.getAllUsers = [
    tokenAuthentication,
    checkApiPermission('sys:user:list'),
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
            const totalCount = await userModel.count();
            // 查询数据库
            const users = await userModel.findAll({
                where: whereConditions,
                order: [[sortColumn, sortOrder]],
                offset: (current - 1) * pageSize,
                limit: pageSize,
            });
            return apiResponse.successResponseWithData(res, "Success.", {
                result: users,
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
 * 创建用户
 * @route POST /v1/sys/user/create
 * @group 用户管理 - 用户相关
 * @param {string} username.required - 用户名
 * @param {string} password.required - 密码
 * @returns {object} 200 - 用户创建成功
 * @returns {Error}  default - 错误响应
 */
exports.createUser = [
    tokenAuthentication,
    checkApiPermission('sys:user:create'),
    body("username").notEmpty().withMessage('用户名不能为空.'),
    body("password").notEmpty().withMessage('密码不能为空.'),
    body("roleId").notEmpty().withMessage('角色不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            // 检查用户名是否已存在
            const existingUser = await userModel.findOne({
                where: {
                    username: req.body.username
                }
            });

            if (existingUser) {
                return apiResponse.validationErrorWithData(res, "用户名已被占用，请选择其他用户名.");
            }

            // 创建新用户
            const newUser = await userModel.create({...req.body});
            return apiResponse.successResponse(res, "用户创建成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 获取单个用户
 * @route POST /v1/sys/user/findOne
 * @group 用户管理 - 用户相关
 * @param {number} id.required - 用户ID
 * @returns {object} 200 - 成功返回单个用户
 * @returns {Error}  default - 错误响应
 */

exports.findOneUser = [
    tokenAuthentication,
    body("id").notEmpty().withMessage('用户ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const userId = req.body.id;
            // 在 attributes 中指定要返回的字段，排除不需要返回的字段
            const user = await userModel.findByPk(userId, {
                attributes: {
                    exclude: ['password']
                }
            });
            if (!user) {
                return apiResponse.notFoundResponse(res, "用户不存在.");
            }

            return apiResponse.successResponseWithData(res, "Success.", user);
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 更新用户
 * @route POST /v1/sys/user/update
 * @group 用户管理 - 用户相关
 * @param {number} id.required - 用户ID
 * @returns {object} 200 - 用户更新成功
 * @returns {Error}  default - 错误响应
 */
exports.updateUser = [
    tokenAuthentication,
    checkApiPermission('sys:user:update'),
    body("id").notEmpty().withMessage('用户ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const userId = req.body.id;

            const user = await userModel.findByPk(userId);
            if (!user) {
                return apiResponse.notFoundResponse(res, "用户不存在.");
            }

            await user.update({...req.body});

            return apiResponse.successResponse(res, "用户更新成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 删除用户
 * @route POST /v1/sys/user/delete
 * @group 用户管理 - 用户相关
 * @param {number} id.required - 用户ID
 * @returns {object} 200 - 用户删除成功
 * @returns {Error}  default - 错误响应
 */
exports.deleteUser = [
    tokenAuthentication,
    checkApiPermission('sys:user:delete'),
    body("id").notEmpty().withMessage('用户ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const userId = req.body.id;

            const user = await userModel.findByPk(userId);
            if (!user) {
                return apiResponse.notFoundResponse(res, "用户不存在.");
            }

            await user.destroy();

            return apiResponse.successResponse(res, "用户删除成功.");
        } catch (err) {
            next(err);
        }
    }
];

