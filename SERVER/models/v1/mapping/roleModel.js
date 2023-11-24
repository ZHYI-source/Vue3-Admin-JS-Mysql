// models/userModel.js
const {DataTypes} = require('sequelize');
const sequelize = require('@config/db.config');
const permissionsModel = require('./permissionsModel')
const RolePermissions = require('./role_permissions')

// https://www.sequelize.cn/core-concepts/model-instances
const Role = sequelize.define('role', // Sequelize模型名 没有提供表名 则以此为表名
    {
        id: {
            type: DataTypes.UUID,
            notNull: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            comment: 'ID',
        },
        roleName: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: '角色名称',
        },
        roleAuth: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: '角色标识',
        },
        remark: {
            type: DataTypes.STRING,
            comment: '角色备注',
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

module.exports = Role;

