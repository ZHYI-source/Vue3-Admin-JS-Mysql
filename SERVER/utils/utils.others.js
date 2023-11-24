const bcrypt = require("bcryptjs");
const request = require("request");
const crypto = require('crypto');
/**
 * 随机数
 *
 * @param { number } length
 */
exports.randomNumber = function (length) {
    let text = "";
    let possible = "123456789";
    for (let i = 0; i < length; i++) {
        let sup = Math.floor(Math.random() * possible.length);
        text += i > 0 && sup === i ? "0" : possible.charAt(sup);
    }
    return Number(text);
};

/**
 * bcrypt 加密数据
 *
 * @param { number , string } value
 */
exports.encryption = function (value) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(value, 10, function (err, hash) {
            if (err) {
                return reject(err)
            }
            resolve(hash)
        });
    })
};

/**
 * bcrypt 解密数据 （密码匹配）
 *
 * @param { number , string  } value 未加密的值
 * @param { string } enValue 已加密的值
 * @return { Promise } true / false 两个密码是否相同
 */
exports.decryption = function (value, enValue) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(value, enValue, function (err, same) {
            if (err) {
                return reject(err)
            }
            resolve(same)
        });
    })
};

// 获取用户的真实公网IP
exports.getPublicIP = function (req) {
    const headers = req.headers;
    if (headers['x-real-ip']) {
        return headers['x-real-ip'];
    }
    if (headers['x-forwarded-for']) {
        const ipList = headers['x-forwarded-for'].split(',');
        return ipList[0];
    }
    return '0.0.0.0';
}


// IP地址解析
exports.parseIP = function (clientIp) {
    return new Promise((resolve, reject) => {
        request(
            `https://opendata.baidu.com/api.php?query=[${clientIp}]&co=&resource_id=6006&oe=utf8`,
            {method: 'GET'},
            function (error, response, body) {
                if (error !== null) {
                    reject(error);
                    return;
                }
                if (body && !body.status) {
                    resolve(body.length && JSON.parse(body).data[0].location || '-');
                }
            }
        );
    });
}

// IP地址解析经纬度
exports.IPToLonAndLat = function (clientIp) {
    return new Promise((resolve, reject) => {
        request(
            `https://ipinfo.io/${clientIp}?token=1c5d78e2e95e22`,
            {method: 'GET'},
            function (error, response, body) {
                if (error !== null) {
                    if (!body) {
                        resolve({});
                        return;
                    }
                }
                if (body) {
                    let b = JSON.parse(body)
                    let info = {
                        ip: b.ip,
                        city: b.city,
                        region: b.region,
                        country: b.country,
                        loc: b.loc ? [Number(b.loc.split(',')[1]), Number(b.loc.split(',')[0])] : '未知',
                        latitude: b.loc ? Number(b.loc.split(',')[0]) : 0, // 纬度
                        longitude: b.loc ? Number(b.loc.split(',')[1]) : 0 // 经度
                    }
                    resolve(info);
                }
            }
        );
    })
}

// 根据邮箱生成头像
exports.getEmailAvatar = function (email) {
    // 使用正则表达式判断邮箱格式是否为 QQ 邮箱
    if (/^[1-9][0-9]{4,10}@qq\.com$/.test(email)) {
        // 如果为 QQ 邮箱，则生成 QQ 头像地址
        return `https://q1.qlogo.cn/g?b=qq&nk=${email}&s=100`;
    } else if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/.test(email)) {
        // 如果为普通邮箱，则生成 Gravatar 头像地址
        // const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
        // return `https://gravatar.kuibu.net/avatar/${hash}?s=100`;
        return `https://www.zhouyi.run:3089/v1/common/files/preview/img/1697161535901.png`;
    } else if (/^[A-Za-z0-9][\w\.-]+[A-Za-z0-9]@163\.com$/.test(email)) {
        // 如果为 163 邮箱，则生成 163 头像地址
        // const user = email.split('@')[0];
        // return `https://mail.163.com/js6/s?func=mbox:getMessageList&sid=zhaohui_hedahua92&r=${Math.random()}&fid=1&user=${user}&l=100`;
        return 'https://www.zhouyi.run:3089/v1/common/files/preview/img/1697161535901.png'
    } else if (/^[A-Za-z0-9][\w\.-]+[A-Za-z0-9]@sina\.cn$/.test(email)) {
        // 如果为新浪邮件，则生成新浪头像地址
        const user = email.split('@')[0];
        return `https://my.sina.com.cn/avatar.php?uid=${user}&size=big`;
    } else {
        // 否则返回默认头像地址
        return 'https://www.zhouyi.run:3089/v1/common/files/preview/img/1697161797912.png';
    }
}
// * 号替换
exports.replaceMiddleWithAsterisks = function (inputString, length = 5) {
    if (inputString.length < 3) {
        return inputString; // 字符串长度小于3，无法替换中间字符
    }
    const middleIndex = Math.floor(inputString.length / 2);
    const start = inputString.slice(0, middleIndex - 1); // 中间字符的前一个字符
    const end = inputString.slice(middleIndex + 2); // 中间字符的后一个字符
    const asterisks = '*'.repeat(length); // 用 '*' 替换中间的3个字符

    return start + asterisks + end;
}
