// controllers/userController.js
const {permissionsModel} = require('@models/v1');
const {body, param, validationResult} = require('express-validator');
const apiResponse = require('@utils/utils.apiResponse')
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const {actionRecords} = require("@middlewares/actionLogMiddleware");
const {checkApiPermission, checkUserRole} = require("@middlewares/authMiddleware");
const {Op} = require('sequelize');

/**
 * 获取所有权限管理
 * @route POST /v1/sys/permissions/list
 * @group 权限管理 - 权限管理相关
 * @returns {object} 200 - 成功返回权限管理列表
 * @returns {Error}  default - 错误响应
 */
exports.getAll = [
    tokenAuthentication,
    checkApiPermission('sys:permissions:list'),
    async (req, res, next) => {
        try {
            const name = req.body.params.name || ''; // 查询参数

            // 构建查询条件
            const where = {};

            if (name) {
                // 只有在 search 不为空时才添加查询条件
                where[Op.or] = [
                    {name: {[Op.like]: `%${name}%`}},
                ];
            }
            // 查询数据库
            const permissionsList = await permissionsModel.findAll({
                where,
            });
            // 将权限文档转换为树状结构
            const resultData = permissionsModel.toTree(permissionsList);

            return apiResponse.successResponseWithData(res, "Success.", {
                result: resultData,
            })
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 获取所有权限树
 * @route POST /v1/sys/permissions/tree
 * @group 权限管理 - 权限管理相关
 * @returns {object} 200 - 成功返回权限管理列表
 * @returns {Error}  default - 错误响应
 */
exports.tree = [
    tokenAuthentication,
    async (req, res, next) => {
        try {
            let query = req.body;
            // 查询数据库
            const permissionsList = await permissionsModel.findAll();
            // 将权限文档转换为树状结构
            const resultData = permissionsModel.toTree(permissionsList);
            return apiResponse.successResponseWithData(res, "Success.", resultData.length > 0 ? {
                result: resultData,
            } : {result: []});
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
            // return apiResponse.ErrorResponse(res, err);
        }
    }
]

// 验证权限标识默认有且仅有一个冒号 :
function hasSingleColon(str, num = 1) {
    const colonCount = (str.match(/:/g) || []).length;
    return colonCount === num;
}

/**
 * 创建权限管理
 * @route POST /v1/sys/permissions/create
 * @group 权限管理 - 权限管理相关
 * @param {string} name.required - 权限名称
 * @param {string} key.required - 权限标识
 * @returns {boolean} 200 - 权限管理创建成功
 * @returns {Error}  default - 错误响应
 */
exports.create = [
    tokenAuthentication,
    checkApiPermission('sys:permissions:create'),
    [
        body("name").notEmpty().withMessage('权限名称不能为空.'),
        body("key").notEmpty().withMessage('权限标识不能为空.'),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const newPermissions = {
                ...req.body
            };

            if (hasSingleColon(newPermissions.key) && newPermissions.autoSon) {
                // 自动生成子级别
                const permissionsList = [
                    {...req.body},
                    {name: '查询', key: newPermissions.key + ':list', parent_key: newPermissions.key, auth: true},
                    {name: '增加', key: newPermissions.key + ':create', parent_key: newPermissions.key, auth: true},
                    {name: '删除', key: newPermissions.key + ':delete', parent_key: newPermissions.key, auth: true},
                    {name: '更新', key: newPermissions.key + ':update', parent_key: newPermissions.key, auth: true}
                ];

                await permissionsModel.bulkCreate(permissionsList);
            } else {
                // 直接创建权限
                await permissionsModel.create(newPermissions);
            }

            return apiResponse.successResponseWithData(res, "添加权限成功.", req.body);
        } catch (err) {
            next(err);
        }
    }
];


/**
 * 获取单个权限管理
 * @route POST /v1/sys/permissions/findOne
 * @group 权限管理 - 权限管理相关
 * @param {number} id.required - 权限管理ID
 * @returns {object} 200 - 成功返回单个权限管理
 * @returns {Error}  default - 错误响应
 */

exports.findOne = [
    tokenAuthentication,
    checkApiPermission('sys:permissions:findOne'),
    body("id").notEmpty().withMessage('权限ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const userId = req.body.id;
            const user = await permissionsModel.findByPk(userId);

            if (!user) {
                return apiResponse.notFoundResponse(res, "权限管理不存在.");
            }

            return apiResponse.successResponseWithData(res, "Success.", user);
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 更新权限管理
 * @route POST /v1/sys/permissions/update
 * @group 权限管理 - 权限管理相关
 * @param {number} id.required - 权限管理ID
 * @returns {object} 200 - 权限管理更新成功
 * @returns {Error}  default - 错误响应
 */
exports.update = [
    tokenAuthentication,
    checkApiPermission('sys:permissions:update'),
    body("id").notEmpty().withMessage('权限ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const permissionsId = req.body.id;

            const permissions = await permissionsModel.findByPk(permissionsId);
            if (!permissions) {
                return apiResponse.notFoundResponse(res, "权限不存在.");
            }

            await permissions.update({...req.body});

            return apiResponse.successResponse(res, "权限更新成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 删除权限管理
 * @route POST /v1/sys/permissions/delete
 * @group 权限管理 - 权限管理相关
 * @param {number} id.required - 权限管理ID
 * @returns {object} 200 - 权限管理删除成功
 * @returns {Error}  default - 错误响应
 */
exports.delete = [
    tokenAuthentication,
    checkApiPermission('sys:permissions:delete'),
    body("id").notEmpty().withMessage('权限ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const permissionsId = req.body.id;

            const permissions = await permissionsModel.findByPk(permissionsId);
            if (!permissions) {
                return apiResponse.notFoundResponse(res, "权限不存在.");
            }

            await permissions.destroy();

            return apiResponse.successResponse(res, "权限删除成功.");
        } catch (err) {
            next(err);
        }
    }
];


/**
 * 停用权限
 * @route POST /v1/sys/permissions/stop
 * @group 权限管理 - 权限管理相关
 * @param {number} id.required - 权限管理ID
 * @returns {object} 200 - 权限管理删除成功
 * @returns {Error}  default - 错误响应
 */
exports.stop = [
    tokenAuthentication,
    checkApiPermission('sys:permissions:stop'),
    body("id").notEmpty().withMessage('权限ID不能为空.'),
    async (req, res, next) => {
        const {id} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
        }
        try {
            const permissionsInfo = await permissionsModel.findByPk(id);
            if (!permissionsInfo) {
                return apiResponse.notFoundResponse(res, "该条数据不存在");
            }
            permissionsInfo.status = !permissionsInfo.status
            await permissionsInfo.save()
            return apiResponse.successResponse(res, "权限管理更新成功.");
        } catch (err) {
            next(err); // 将错误传递给下一个中间件（全局错误处理中间件）
        }
    }
];
