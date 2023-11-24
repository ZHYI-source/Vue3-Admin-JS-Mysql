const chalk = require('chalk');

// 自定义的日志函数，过滤掉查询语句的输出
function myCustomLoggerFunction(log) {
    if (log.includes('Executing (default):')) {
        return;
    }
    console.log(log);
}

const config = {
    // 连接池配置
    pool: {
        max: 10,            // 最大连接数
        min: 0,             // 最小连接数
        acquire: 30000,     // 获取连接的超时时间（毫秒）
        idle: 10000         // 连接在池中保持空闲的最长时间（毫秒）
    },

    // 数据库连接配置
    dialect: 'mysql',    // 使用的数据库类型
    host: process.env.DB_HOST,   // 数据库主机地址
    username: process.env.DB_USERNAME, // 数据库用户名
    password: process.env.DB_PASSWORD, // 数据库密码
    database: process.env.DB_NAME, // 数据库名称

    // 其他可选配置
    logging: myCustomLoggerFunction,       // 是否输出 Sequelize 的日志，默认为 console.log
    define: {
        timestamps: true,   // 是否自动添加 createdAt 和 updatedAt 列
        underscored: false,  // 是否启用下划线命名法 (snake_case)，默认是驼峰命名法 (camelCase)
        paranoid: false      // 是否启用软删除，即添加 deletedAt 列
    }
};


const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(config);


/**
 *@author ZY
 *@date 2023/11/17
 *@Description:数据库连接失败请检查数据库是否建立账号密码是否正确 位置：.env.*文件
 */
// 数据库连接的监听器
sequelize.authenticate()
    .then(() => {
        console.log(chalk.hex('#bf00d0').bold(`******************数据库连接成功********************`));
        console.log(chalk.hex('#bf00d0').bold(`【数据库】：数据库连接已成功建立.`));
        console.log(chalk.hex('#bf00d0').bold(`【数据库主机】：${process.env.DB_HOST}`));
        console.log(chalk.hex('#bf00d0').bold(`【数据库名称】：${process.env.DB_NAME}`));
        // 同步模型与数据库
        sequelize
            .sync({logging: false}) // 关闭数据库同步日志
            .then(() => {
                console.log(chalk.hex('#bf00d0').bold(`【数据库状态】：数据库和表已同步`));
                console.log(chalk.hex('#bf00d0').bold(`******************数据库连接成功********************`));
            })
            .catch(err => {
                console.error('同步数据库错误:', err);
            });
    })
    .catch(err => {
        console.log(chalk.red.bold(`******************数据库连接失败*********************`));
        console.log(chalk.red.bold(`【数据库主机】：${process.env.DB_HOST}`));
        console.log(chalk.red.bold(`【数据库名称】：${process.env.DB_NAME}`));
        console.log(chalk.red.bold(`【数据库用户名】：${process.env.DB_USERNAME}`));
        console.log(chalk.red.bold(`【数据库密码】：${process.env.DB_PASSWORD}`));
        console.log(chalk.red.bold(`******************数据库连接失败*********************`));
        console.error('数据库连接失败错误信息:', err);
    });

module.exports = sequelize;
