const {DataTypes} = require('sequelize');
const sequelize = require('@config/db.config');
const Role = require('./roleModel');
const role_permissions = require('./role_permissions');
// 权限表
// https://www.sequelize.cn/core-concepts/model-instances
const Permissions = sequelize.define('permissions', // Sequelize模型名 没有提供表名 则以此为表名
    {
        id: {
            type: DataTypes.UUID,
            notNull: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            comment: 'ID',
        },
        name: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: '权限名称',
        },
        key: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: '权限键',
        },
        parent_key: {
            type: DataTypes.STRING,
            comment: '父级权限键（可选）',
        },
        auth: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: '是否是权限按钮',
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,  // 1 正常 0 停用
            comment: '状态',
        },
    },
    {
        freezeTableName: true, // 禁止表名自动复数化
    });

// 添加静态方法: 转换为树状结构
Permissions.toTree = function (permissions) {
    const tree = [];
    const map = {};
    permissions.forEach(permission => {
        map[permission.dataValues.key] = { ...permission.dataValues };
    });
    permissions.forEach(permission => {
        const parent = map[permission.dataValues.parent_key];
        if (parent) {
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(map[permission.dataValues.key]);
        } else {
            tree.push(map[permission.dataValues.key]);
        }
    });
    return tree;
};

// 添加静态方法: 转换为扁平结构
Permissions.toFlat = function (permissions) {
    const flat = [];
    const flatten = (permission, parentKey = null) => {
        const flatPermission = { ...permission, parentKey };
        flat.push(flatPermission);

        permission.children.forEach(child => {
            flatten(child, permission.dataValues.key);
        });
    };

    permissions.forEach(permission => {
        flatten(permission);
    });

    return flat;
};

module.exports = Permissions;

