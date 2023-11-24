// controllers/userController.js
const {roleModel, permissionsModel, role_permissions} = require('@models/v1');
const {body, param, validationResult} = require('express-validator');
const apiResponse = require('@utils/utils.apiResponse')
const tokenAuthentication = require('@middlewares/tokenAuthentication')
const {checkApiPermission, checkUserRole} = require("@middlewares/authMiddleware");
const {actionRecords} = require("@middlewares/actionLogMiddleware");
const {Op} = require('sequelize');

//角色和权限是多对多的
roleModel.belongsToMany(permissionsModel, {
    through: {
        model: role_permissions,
        unique: false,
    }, foreignKey: 'roleId',
});
permissionsModel.belongsToMany(roleModel, {
    through: {
        model: role_permissions,
        unique: false,
    }, foreignKey: 'permissionsId',
});

/**
 * 获取所有角色管理
 * @route POST /v1/sys/role/list
 * @group 角色管理 - 角色管理相关
 * @returns {object} 200 - 成功返回角色管理列表
 * @returns {Error}  default - 错误响应
 */
exports.getAll = [
    tokenAuthentication,
    checkApiPermission('sys:role:list'),
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
            const totalCount = await roleModel.count();
            // 查询数据库
            const roles = await roleModel.findAll({
                where: whereConditions,
                order: [[sortColumn, sortOrder]],
                offset: (current - 1) * pageSize,
                limit: pageSize,
                include: [{
                    model: permissionsModel,
                    attributes: ['key'], // 只包含 key 字段
                    through: {attributes: []} // 不包括中间表
                }],
            });

            for (const role of roles) {
                role.dataValues.perms = role.dataValues.permissions.length > 0 ? role.dataValues.permissions.map(permission => permission.key) : [];
                delete role.dataValues.permissions
            }
            return apiResponse.successResponseWithData(res, "Success.", {
                result: roles,
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
 * 创建角色管理
 * @route POST /v1/sys/role/create
 * @group 角色管理 - 角色管理相关
 * @param {string} username.required - 角色管理名
 * @param {string} password.required - 密码
 * @returns {object} 200 - 角色管理创建成功
 * @returns {Error}  default - 错误响应
 */
exports.create = [
    tokenAuthentication,
    checkApiPermission('sys:role:create'),
    body("roleName").notEmpty().withMessage('角色名不能为空.'),
    body("roleAuth").notEmpty().withMessage('角色标识不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            // 检查角色是否已存在
            const existingRole = await roleModel.findOne({
                where: {
                    roleAuth: req.body.roleAuth
                }
            });

            if (existingRole) {
                return apiResponse.validationErrorWithData(res, "添加失败,角色标识已存在.");
            }

            // 创建新角色管理
            const newUser = await roleModel.create({...req.body});
            return apiResponse.successResponse(res, "角色管理创建成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 获取单个角色管理
 * @route POST /v1/sys/role/findOne
 * @group 角色管理 - 角色管理相关
 * @param {number} id.required - 角色管理ID
 * @returns {object} 200 - 成功返回单个角色管理
 * @returns {Error}  default - 错误响应
 */

exports.findOne = [
    tokenAuthentication,
    body("id").notEmpty().withMessage('角色管理ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const roleId = req.body.id;
            const role = await roleModel.findByPk(roleId, {
                include: [{
                    model: permissionsModel,
                    attributes: ['key'], // 只包含 key 字段
                    through: {attributes: []} // 不包括中间表
                }],
            });

            if (!role) {
                return apiResponse.notFoundResponse(res, "角色不存在.");
            }
            role.dataValues.permissions = role.permissions.map(permission => permission.key);

            return apiResponse.successResponseWithData(res, "Success.", role.dataValues);
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 更新角色管理
 * @route POST /v1/sys/role/update
 * @group 角色管理 - 角色管理相关
 * @param {number} id.required - 角色管理ID
 * @returns {object} 200 - 角色管理更新成功
 * @returns {Error}  default - 错误响应
 */
exports.update = [
    tokenAuthentication,
    checkApiPermission('sys:role:update'),
    body("id").notEmpty().withMessage('角色管理ID不能为空.'),
    body("perms").notEmpty().withMessage('角色管理IDs不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            const roleId = req.body.id;
            const rolePermissions = req.body.perms;
            const existingRole = await roleModel.findByPk(roleId);
            if (!existingRole) {
                return apiResponse.notFoundResponse(res, "角色管理不存在.");
            }

            const permissions = await permissionsModel.findAll({
                where: { key: rolePermissions }
            });

            // 从权限表中提取id
            const permissionIds = permissions.map(permission => permission.id);

            // 将权限分配给角色
            await existingRole.setPermissions(permissionIds);
            // 更新角色信息
            await existingRole.update({...req.body});

            return apiResponse.successResponse(res, "角色管理更新成功.");
        } catch (err) {
            next(err);
        }
    }
];

/**
 * 删除角色管理
 * @route POST /v1/sys/role/delete
 * @group 角色管理 - 角色管理相关
 * @param {number} id.required - 角色管理ID
 * @returns {object} 200 - 角色管理删除成功
 * @returns {Error}  default - 错误响应
 */
exports.delete = [
    tokenAuthentication,
    checkApiPermission('sys:role:delete'),
    checkUserRole(), // 只允许超级管理员操作
    body("id").notEmpty().withMessage('角色管理ID不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }

            const userId = req.body.id;

            const role = await roleModel.findByPk(userId);
            if (!role) {
                return apiResponse.notFoundResponse(res, "角色不存在.");
            }

            if (role.roleAuth === 'SUPER') {
                return apiResponse.unauthorizedResponse(res, "无法删除超级管理员角色.");
            }
            // 从角色权限表中删除关联的权限
            await role.setPermissions([]);
            // 删除角色本身
            await role.destroy();

            return apiResponse.successResponse(res, "角色管理删除成功.");
        } catch (err) {
            next(err);
        }
    }
];


/**
 * 角色分配角色
 * @route POST /v1/sys/role/assignAuthority
 * @group 角色管理 - 角色管理相关
 * @param {number} id.required - 角色ID
 * @param {Array} permIds.required - 权限ID数组
 * @returns {object} 200 - 角色管理删除成功
 * @returns {Error}  default - 错误响应
 */
exports.assignAuthority = [
    tokenAuthentication,
    checkApiPermission('sys:role:assignAuthority'),
    body("id").notEmpty().withMessage('角色ID不能为空.'),
    body("permIds").notEmpty().withMessage('权限ID数组不能为空.'),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "参数错误.", errors.array()[0].msg);
            }
            // 检查角色是否已存在
            const existingRole = await roleModel.findByPk(req.body.id);

            if (!existingRole) {
                return apiResponse.notFoundResponse(res, "角色不存在.");
            }
            // 查找要分配的权限
            const permissionsToAssign = await permissionsModel.findAll({
                where: {
                    id: req.body.permIds
                }
            });

            if (permissionsToAssign.length !== req.body.permIds.length) {
                return apiResponse.notFoundResponse(res, "某些权限不存在.");
            }

            // 将权限分配给角色
            await existingRole.setPermissions(permissionsToAssign);

            return apiResponse.successResponse(res, "角色权限分配成功.");
        } catch (err) {
            next(err);
        }
    }
]
