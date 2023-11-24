
const {DataTypes} = require('sequelize');
const sequelize = require('@config/db.config');
// https://www.sequelize.cn/core-concepts/model-instances
module.exports = sequelize.define('user_opt_log', // Sequelize模型名 没有提供表名 则以此为表名
    {
        id:{
            type: DataTypes.UUID,
            notNull: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        operator: {
            type: DataTypes.STRING,
            comment: '操作人'
        },
        operatorId: {
            type: DataTypes.STRING,
            comment: '操作人ID'
        },
        module: {
            type: DataTypes.STRING,
            comment: '操作模块'
        },
        platform: {
            type: DataTypes.STRING,
            comment: '操作平台'
        },
        operatorIP: {
            type: DataTypes.STRING,
            comment: '设备IP'
        },
        latitude: {
            type: DataTypes.DOUBLE,
            comment: '纬度'
        },
        longitude: {
            type: DataTypes.DOUBLE,
            comment: '经度'
        },
        address: {
            type: DataTypes.STRING,
            comment: '设备位置'
        },
        content: {
            type: DataTypes.STRING,
            comment: '操作内容'
        },
    },
    {
        freezeTableName: true, // 禁止表名自动复数化
    });
