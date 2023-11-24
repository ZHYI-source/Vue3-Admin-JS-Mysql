const {DataTypes} = require('sequelize');
const sequelize = require('@config/db.config');
// 权限表
// https://www.sequelize.cn/core-concepts/model-instances
const Resources = sequelize.define('resources', // Sequelize模型名 没有提供表名 则以此为表名
    {
        id: {
            type: DataTypes.UUID,
            notNull: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            comment: 'ID',
        },
        srcName: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: '资源名称',
        },
        srcType: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: '资源类型',
        },
        previewPath: {
            type: DataTypes.TEXT,
            comment: '资源预览路径',
        },
        downloadPath: {
            type: DataTypes.TEXT,
            comment: '资源预览路径',
        },
        deletePath: {
            type: DataTypes.TEXT,
            comment: '资源删除路径',
        },
        userId: {
            type: DataTypes.UUID,
            comment: '用户ID',
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: '状态',
        },
        srcSize: {
            type: DataTypes.STRING,
            comment: '资源大小',
        },
        remark: {
            type: DataTypes.STRING,
            comment: '备注',
        },
    },
    {
        freezeTableName: true, // 禁止表名自动复数化
    });

module.exports = Resources;

