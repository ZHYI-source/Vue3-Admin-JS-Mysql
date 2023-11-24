require('./alias'); // 引入路径别名配置文件

const isDev = process.env.NODE_ENV === 'development';
// 访问不同的 .env 文件
require('dotenv').config({path: isDev ? './.env.development' : './.env.production'});
// app.js
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const cors = require('cors');
const app = express();
const sessionAuth = require('./middlewares/sessionMiddleware');

const errorHandler = require('./utils/utils.errorHandler');
const apiResponse = require('./utils/utils.apiResponse');
// Session全局中间件配置
app.use(sessionAuth);
// Middleware
app.use(bodyParser.json());

// 解决跨域
app.use(cors());
// 使用swagger API文档，必须在解决跨域设置数据格式之前
const options = require('./config/swagger.config'); // 配置信息
const expressSwagger = require('express-swagger-generator')(app);
expressSwagger(options);
// 开发环境启动请求日志
isDev && app.use(logger('dev'));

const db = require("./models/v1");
// db.sequelize.sync();
// db.userModel.sync({ alter: true })
// console.log(db.userModel)

// Routes
const routes = require('./routes');
app.use(routes); // 无前缀加载所有路由 http://localhost:3000/v1/user

// 添加全局错误处理中间件
app.use(errorHandler);

// throw 404 if URL not found
app.all('*', function (req, res) {
    return apiResponse.notFoundResponse(res, '404 --- 接口不存在');
});


app.listen(process.env.PORT, () => {
    console.log(chalk.hex('#031dc9').bold(`****************************************************`));
    console.log(chalk.hex('#6dff00').bold(`【接口地址】: ${process.env.URL}:${process.env.PORT}/v1`));
    console.log(chalk.hex('#6dff00').bold(`【文档地址】: ${process.env.URL}:${process.env.PORT}/swagger`));
    console.log(chalk.hex('#6dff00').bold(`【在线API文档】: https://console-docs.apipost.cn/preview/38398488376e89f7/a8cca560fbceec30`));
    console.log(chalk.hex('#8e44ad').bold(`【启动环境】：${isDev ? '开发环境' : '生产环境'}`));
    console.log(chalk.hex('#10d7a0').bold(`【项目作者】：ZHOUYI  https://www.zhouyi.run`));
    console.log(chalk.hex('#031dc9').bold(`****************************************************`));
});
