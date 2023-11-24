// models/userModel.js
const {DataTypes} = require('sequelize');
const sequelize = require('@config/db.config');
const {aes} = require('@utils/utils.crypto')

// https://www.sequelize.cn/core-concepts/model-instances
module.exports = sequelize.define('user', // Sequelize模型名 没有提供表名 则以此为表名
    {
        id:{
            type: DataTypes.UUID,
            notNull: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            comment: 'ID',
        },
        roleId: {
            type: DataTypes.STRING,
            comment: '角色ID'
        },
        avatar:{
            type: DataTypes.TEXT,
            comment: '用户头像'
        },
        username: {
            type: DataTypes.STRING,
            notEmpty: true,
            notNull: true,
            allowNull: false,
            comment: '用户名',
        },
        password:{
            type: DataTypes.STRING,
            notNull: true,
            notEmpty: true,
            comment: '密码',
            defaultValue: 'Vchs0bbdk2pr/Ac6DsHruw==',
            set(value) {
                // 在数据库中以明文形式存储密码是很糟糕的.
                // 使用适当的aes对称加密更好.
                this.setDataValue('password', aes.en(value));
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: '邮箱',
        },
        nickname: {
            type: DataTypes.STRING,
            defaultValue: "John Doe",
            comment: '昵称',
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 1,  // 1 正常 2 停用
            comment: '状态',
        },
        remark: {
            type: DataTypes.STRING,
            comment: '角色备注',
        },
    },
    {
        freezeTableName: true, // 禁止表名自动复数化
    });
