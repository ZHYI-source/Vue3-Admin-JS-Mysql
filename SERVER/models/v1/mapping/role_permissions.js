const {DataTypes} = require('sequelize');
const sequelize = require('@config/db.config');
// 角色——权限表
// https://www.sequelize.cn/core-concepts/model-instances
const RolePermissions = sequelize.define('role_permissions', // Sequelize模型名 没有提供表名 则以此为表名
    {
        id:{
            type: DataTypes.UUID,
            notNull: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            comment: 'ID',
        },
        roleId: {
            type: DataTypes.UUID,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: '角色ID',
        },
        permissionsId: {
            type: DataTypes.UUID,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: '权限ID',
        },
    },
    {
        freezeTableName: true, // 禁止表名自动复数化
    });

module.exports = RolePermissions;
