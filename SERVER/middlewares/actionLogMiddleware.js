const chalk = require('chalk');
const UAParser = require("ua-parser-js");
const request = require("request");
const {userOptLogModel} = require('@models/v1');
const {IPToLonAndLat, parseIP, getPublicIP,} = require("@utils/utils.others");


/**
 * 记录操作日志.
 * @param {string}  module 模块名
 * @param {string}  content 操作内容
 * @returns {Function}
 */
const actionRecords = ({module, content}) => {
    return async (req, res, next) => {
        try {
            const clientIP = getPublicIP(req);
            // let whiteList = ['0.0.0.0','192.168.195.214','192.168.1.104','223.209.0.217','111.121.41.242','111.121.47.88']
            // if (whiteList.includes(clientIP)) return next();
            //识别常见的浏览器、操作系统和设备等信息
            const u = new UAParser(req.headers['user-agent']);
            const address = await parseIP(clientIP);
            const IpInfo = await IPToLonAndLat(clientIP);

            const newUsersOptLog = {
                operatorId: req.userId || '-',
                operator: req.user?.nickname || req.body.username || '未知',
                module,
                platform: u.getBrowser().name ? `${u.getBrowser().name}.v${u.getBrowser().major}` : '未知',
                operatorIP: clientIP,
                latitude:IpInfo.latitude,
                longitude:IpInfo.longitude,
                address: address || '-',
                content: content || `${req.originalUrl}`
            };

            await userOptLogModel.create(newUsersOptLog);
            next();
        } catch (err) {
            console.error(chalk.red('操作日志记录失败'), err);
        }
    };
};

module.exports = {actionRecords};
