const jwt = require("jsonwebtoken");
const {body, query, validationResult} = require('express-validator');
const {userModel} = require('@models/v1')
const apiResponse = require('@utils/utils.apiResponse')
const mailer = require('@utils/utils.mailer')
const {randomNumber, encryption, parseIP, getPublicIP, getEmailAvatar, decryption} = require('@utils/utils.others')
const log = require('@utils/utils.logger')
const svgCaptcha = require('svg-captcha');
const {actionRecords} = require("@middlewares/actionLogMiddleware");
const logger = require('@utils/utils.logger')
const UAParser = require("ua-parser-js");
const axios = require("axios");
const querystring = require('querystring');
const {aes} = require('@utils/utils.crypto')
/**
 * TODO:
 *   express-validator : https://express-validator.github.io/docs/
 *   参数校验方法查询（基于validator.js库）: https://github.com/validatorjs/validator.js#Validators
 *   eg:isLength isEmail trim ...
 * */
/******************************************************************************************/

/**
 * 验证码
 * @route GET /v1/sys/auth/captcha
 * @group 权限验证 - 登录注册相关
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
exports.captcha = [
    async (req, res) => {
        try {
            //验证码配置api
            let options = {
                //线条数
                noise: Math.floor(Math.random() * 5),
                color: true,
                fontSize: 55,
                width: 90,
                height: 38,
            }
            let captcha = svgCaptcha.createMathExpr(options)
            //存储到session
            req.session.code = captcha.text
            console.log(req.session.code)
            apiResponse.successResponseWithData(res, "成功.", captcha.data);
        } catch (err) {
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        }
    }
]

/**
 * 登录
 * @route POST /v1/sys/auth/login
 * @group 权限验证 - 登录注册相关
 * @param {string} username 用户名
 * @param {string} password 密码
 * @param {string} code 验证码
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
exports.login = [
    actionRecords({module: '登录'}),
    //参数验证
    [
        body("username").notEmpty().withMessage('用户名不能为空.'),
        body("password").notEmpty().withMessage('密码不能为空.'),
        body("code").notEmpty().withMessage('验证码不能为空.'),
    ],

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            } else {
                if (!req.session.code) return apiResponse.validationErrorWithData(res, "验证码已失效");
                if (req.session.code !== req.body.code) return apiResponse.validationErrorWithData(res, "验证码错误");
                const userWithData = await userModel.findOne({ where: {username: req.body.username} })
                if (!userWithData) return apiResponse.validationErrorWithData(res, "用户名不存在");
                // 密码和数据库密码匹配
                let isPass = aes.en(req.body.password) === userWithData.password
                if (!isPass) return apiResponse.validationErrorWithData(res, "用户名或密码错误");
                if (!userWithData.status) return apiResponse.unauthorizedResponse(res, "当前账户已被禁用,请联系管理员.");

                // 构建响应给前端的数据
                let userData = {
                    id: userWithData.id,
                    username: userWithData.username,
                    nickname: userWithData.nickname,
                    roleId: userWithData.roleId,
                    status: userWithData.status,
                };
                userData.token = 'Bearer ' + jwt.sign(
                    userData,
                    process.env.SIGN_KEY,
                    {
                        expiresIn: 3600 * 24 * 3 // token 3天有效期
                    }
                )
                log.info(`*** 昵称: ${userWithData.nickname} 登录成功`)
                return apiResponse.successResponseWithData(res, "登录成功.", userData);
            }
        } catch (err) {
            console.log(err);
            log.error(`*** ${req.body.username} 登录失败 ** 错误信息 : ${JSON.stringify(err)}`)
            return apiResponse.ErrorResponse(res, err);
        }
    }
]

/**
 * User login 码云单点登录.
 * @param {string}  code 码云授权码
 * @returns {Object}
 */

exports.giteeLogin = [
    // 参数验证
    [query("code").notEmpty().withMessage('码云授权码不能为空.')],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // 处理验证错误并返回适当的响应
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            } else {
                // 码云 OAuth 应用的客户端ID、客户端秘钥和回调URL
                const CLIENT_ID = 'b1297cb3d4b6ebffeb0c90080b0211e2fe15d81e8e4cd31f95f2316a4de2ffe5';
                const CLIENT_SECRET = 'd0918f6ea72c87055e2b9b841e08f3b57e0638409d60a99ac500da623a89b889';
                const REDIRECT_URI = 'https://zhouyi.run:3089/v1/sys/auth/giteeLogin';

                // 从请求中获取授权码
                const code = req.query.code;

                // 使用授权码获取访问令牌
                const tokenResponse = await axios.post('https://gitee.com/oauth/token', querystring.stringify({
                    code,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    redirect_uri: REDIRECT_URI,
                    grant_type: 'authorization_code',
                }));

                const accessToken = tokenResponse.data.access_token;

                // 使用访问令牌访问码云API获取用户信息
                const userResponse = await axios.get('https://gitee.com/api/v5/user', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const user = userResponse.data;

                // 检查用户是否已存在
                const userWithData = await userModel.findOne({username: user.name});

                if (!userWithData) {
                    // 如果用户不存在，则注册新用户
                    const clientIP = getPublicIP(req);
                    const u = new UAParser(req.headers['user-agent']);
                    const address = await parseIP(clientIP);
                    const equipment = u.getBrowser().name ? `${u.getBrowser().name}.v${u.getBrowser().major}` : '未知';

                    const enPassword = await encryption(user.name); // 密码加密，默认用户名和密码相同
                    const avatar = await getEmailAvatar(user.name);

                    // 创建新用户
                    const newUser = {
                        type: 'admin', // 默认管理端用户
                        avatar: user.avatar_url || avatar,
                        nickname: user.name,
                        username: user.name,
                        password: enPassword,
                        userIp: clientIP,
                        website: user.blog || '',
                        email: user.email || null,
                        address,
                        remark: 'Gitee',
                        platform: equipment,
                        roleId: '64a7aa20a971facd04696242',
                    };

                    const addInfo = await userModel.create(newUser);

                    if (addInfo) {
                        // 构建响应给前端的数据
                        const userData = {
                            _id: addInfo._id,
                            username: addInfo.username,
                            nickname: addInfo.nickname,
                            roleId: addInfo.roleId,
                            status: addInfo.status,
                        };
                        userData.token = 'Bearer ' + jwt.sign(
                            userData,
                            process.env.SIGN_KEY,
                            {
                                expiresIn: 3600 * 24 * 3, // token 3天有效期
                            }
                        );

                        // 重定向到前端登录页面并传递用户数据
                        return res.redirect('http://admin.zhouyi.run/#/login?userData=' + JSON.stringify(userData));
                    }
                } else {
                    if (!userWithData.status) return apiResponse.unauthorizedResponse(res, "当前账户已被禁用,请联系管理员.");

                    // 构建响应给前端的数据
                    const userData = {
                        _id: userWithData._id,
                        username: userWithData.username,
                        nickname: userWithData.nickname,
                        roleId: userWithData.roleId,
                        status: userWithData.status,
                    };
                    userData.token = 'Bearer ' + jwt.sign(
                        userData,
                        process.env.SIGN_KEY,
                        {
                            expiresIn: 3600 * 24 * 3, // token 3天有效期
                        }
                    );
                    // 重定向到前端登录页面并传递用户数据
                    return res.redirect('http://admin.zhouyi.run/#/login?userData=' + JSON.stringify(userData));
                }
            }
        } catch (err) {
            log.error(`*** 码云授权登录失败请重新登录 ** 错误信息 : ${JSON.stringify(err)}`);
            return apiResponse.ErrorResponse(res, err);
        }
    }
];

/**
 * User login github单点登录.
 * @param {string}  code github授权码
 * @returns {Object}
 */

exports.githubLogin = [
    // 参数验证
    [query("code").notEmpty().withMessage('github授权码不能为空.')],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // 处理验证错误并返回适当的响应
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            } else {
                // github OAuth 应用的客户端ID、客户端秘钥和回调URL   https://github.com/settings/applications/2361469
                const CLIENT_ID = 'ed16b155150aab848cff';
                const CLIENT_SECRET = '48755367f3481521114ca9a78359f9017cd9b043';
                const REDIRECT_URI = 'https://zhouyi.run:3089/v1/sys/auth/githubLogin';

                // 从请求中获取授权码
                const code = req.query.code;

                // 使用授权码获取访问令牌
                const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
                        code,
                        client_id: CLIENT_ID,
                        client_secret: CLIENT_SECRET,
                        redirect_uri: REDIRECT_URI,
                    },
                    {
                        headers: {
                            'Accept': 'application/json',
                        },
                    });

                const accessToken = tokenResponse.data.access_token;

                // 使用访问令牌访问码云API获取用户信息
                const userResponse = await axios.get('https://api.github.com/user', {
                    headers: {
                        'Accept': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                //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
                const user = userResponse.data;

                console.log("github账号信息", user)
                logger.info(JSON.stringify(user))

                // 检查用户是否已存在
                const userWithData = await userModel.findOne({username: user.name});

                if (!userWithData) {
                    // 如果用户不存在，则注册新用户
                    const clientIP = getPublicIP(req);
                    const u = new UAParser(req.headers['user-agent']);
                    const address = await parseIP(clientIP);
                    const equipment = u.getBrowser().name ? `${u.getBrowser().name}.v${u.getBrowser().major}` : '未知';

                    const enPassword = await encryption(user.name); // 密码加密，默认用户名和密码相同
                    const avatar = await getEmailAvatar(user.name);

                    // 创建新用户
                    const newUser = {
                        type: 'admin', // 默认管理端用户
                        avatar: user.avatar_url || avatar,
                        nickname: user.name,
                        username: user.name,
                        password: enPassword,
                        userIp: clientIP,
                        website: user.blog || '',
                        email: user.email || null,
                        address,
                        remark: 'Github',
                        platform: equipment,
                        roleId: '64a7aa20a971facd04696242',
                    };

                    const addInfo = await userModel.create(newUser);

                    if (addInfo) {
                        // 构建响应给前端的数据
                        const userData = {
                            _id: addInfo._id,
                            username: addInfo.username,
                            nickname: addInfo.nickname,
                            roleId: addInfo.roleId,
                            status: addInfo.status,
                        };
                        userData.token = 'Bearer ' + jwt.sign(
                            userData,
                            process.env.SIGN_KEY,
                            {
                                expiresIn: 3600 * 24 * 3, // token 3天有效期
                            }
                        );

                        // 重定向到前端登录页面并传递用户数据
                        return res.redirect('http://admin.zhouyi.run/#/login?userData=' + JSON.stringify(userData));
                    }
                } else {
                    if (!userWithData.status) return apiResponse.unauthorizedResponse(res, "当前账户已被禁用,请联系管理员.");

                    // 构建响应给前端的数据
                    const userData = {
                        _id: userWithData._id,
                        username: userWithData.username,
                        nickname: userWithData.nickname,
                        roleId: userWithData.roleId,
                        status: userWithData.status,
                    };
                    userData.token = 'Bearer ' + jwt.sign(
                        userData,
                        process.env.SIGN_KEY,
                        {
                            expiresIn: 3600 * 24 * 3, // token 3天有效期
                        }
                    );

                    // 重定向到前端登录页面并传递用户数据
                    return res.redirect('http://admin.zhouyi.run/#/login?userData=' + JSON.stringify(userData));
                }
            }
        } catch (err) {
            log.error(`*** github授权登录失败请重新登录 ** 错误信息 : ${JSON.stringify(err)}`);
            return apiResponse.ErrorResponse(res, err);
        }
    }
];

/**
 * 注册
 * @route POST /v1/sys/auth/register
 * @group 权限验证 - 登录注册相关
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @param {string} username 昵称
 * @returns {object} 200 - {"status": 1,"message": "...","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
exports.register = [
    // actionRecords({module: '注册'}),
    //必填参数验证
    [
        body("nickname").notEmpty().withMessage('昵称不能为空.'),
        body("username").notEmpty().withMessage('用户名不能为空.').custom((value, {req}) => {
            return userModel.findOne({username: value}).then(user => {
                if (user) {
                    return Promise.reject(`用户名:${user.username}已经注册,请更换其他.`);
                }
            });
        }),
        body("password").notEmpty().withMessage('密码不能为空.').isLength({min: 6}).trim().withMessage('密码不能小于6位.'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.error('****validationError*****: '+errors.array()[0].msg)
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            } else {
                const clientIP = getPublicIP(req);
                //识别常见的浏览器、操作系统和设备等信息
                const u = new UAParser(req.headers['user-agent']);
                const address = await parseIP(clientIP);
                const equipment = u.getBrowser().name ? `${u.getBrowser().name}.v${u.getBrowser().major}` : '未知'

                // 密码加密
                let enPassword = await encryption(req.body.password)
                let avatar = await getEmailAvatar(req.body.email)
                //Save users.
                let newUser = {
                    type: 'admin',//默认管理端用户
                    avatar: req.body.avatar || avatar,
                    nickname: req.body.nickname,
                    username: req.body.username,
                    password: enPassword,
                    userIp: clientIP,
                    email: req.body.email,
                    address,
                    platform: equipment,
                    roleId: '64a7aa20a971facd04696242',
                };
                const addInfo = await userModel.create(newUser)
                if (addInfo) {
                    //发送邮件
                    addInfo.email && await mailer.send(req.body.email,
                        '✨✨注册成功通知',
                        `
                        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            text-align: center;
        }
        .logo {
            width: 100px;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            margin-top: 20px;
        }
        .content-text {
          font-weight: bold;
          color: #2f1e2e;
        }
        .bold {
            font-weight: bold;
        }
        .indent {
            text-indent: 2em;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="http://admin.zhouyi.run/assets/logo-8cf4e032.png" alt="ZHOUYI Logo" class="logo">
        </div>
        <div class="content">
            <p class="indent content-text">恭喜您已注册成功,感谢您的使用ZY·ADMIN！</p>
            <p class="bold">✨您的账号： ${req.body.username || '-'}</p>
            <p class="bold">✨您的密码： ${req.body.password || '-'}</p>
            <p class="bold">✨ZHOUYI前台： https://www.zhouyi.run</p>
            <p class="bold">✨ZHOUYI管理端： http://admin.zhouyi.run</p>
             <p class="bold">🎉🎉🎉 <a href="https://www.zhouyi.run/#/contact">留言板传送门</a></p>
            <p class="indent">祝您工作顺利，心想事成!</p>
        </div>
    </div>
</body>
</html>
                        `)
                    log.info(`+++ 新用户: ${req.body.username} 注册成功`)
                    return apiResponse.successResponse(res, "注册成功");
                }
            }
        } catch (err) {
            console.log(err)
            return apiResponse.ErrorResponse(res, err);
        }
    }
]


/**
 * User Verify Confirm code 用户账号邮件验证码确认
 * @param {string}  email  邮箱
 * @param {string}  opt    验证码
 * @returns {Object}
 */
exports.verifyConfirm = [
    //必填参数验证
    [
        query("email").notEmpty().withMessage('邮箱不能为空.').isEmail().normalizeEmail().withMessage("邮箱格式不正确."),
        query("code").notEmpty().withMessage('验证码不能为空.').withMessage("验证码不能为空."),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.error('****validationError*****: '+errors.array()[0].msg)
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            } else {
                let {code} = req.session
                if (!code) return apiResponse.unauthorizedResponse(res, "验证码已失效,请重新获取.");
                //
                let query = {email: req.query.email};
                const userInfo = await userModel.findOne(query)
                if (!userInfo) return apiResponse.unauthorizedResponse(res, "邮箱号码不存在.");

                // if (userInfo.confirmOTP === req.query.code) {
                if (code === Number(req.query.code)) {
                    userModel.findOneAndUpdate(query, {
                        isConfirmed: 1,
                    }).catch(err => {
                        return apiResponse.ErrorResponse(res, err);
                    });
                    return apiResponse.successResponse(res, "账户验证成功！可进行登录.");
                } else {
                    return apiResponse.unauthorizedResponse(res, "验证码错误");
                }
            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
]


/**
 * Resend Confirm code. 重发验证码
 * @param {string}  email  邮箱
 * @returns {Object}
 */
exports.resendConfirmCode = [
    //必填参数验证
    query("email").notEmpty().withMessage('邮箱不能为空.').isEmail().normalizeEmail().withMessage("邮箱格式不正确."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.error('****validationError*****: '+errors.array()[0].msg)
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            } else {
                //
                let query = {email: req.query.email};
                const userInfo = await userModel.findOne(query)
                if (!userInfo) return apiResponse.unauthorizedResponse(res, "邮箱号码不存在.");
                if (userInfo.isConfirmed) return apiResponse.unauthorizedResponse(res, "账户已经验证.");

                // 生成新验证码
                let newCode = randomNumber(4);

                // 更新用户验证状态 验证码
                await userModel.findOneAndUpdate(query, {isConfirmed: 0}).catch(err => {
                    return apiResponse.ErrorResponse(res, err);
                })
                // 发送验证码
                await mailer.send(req.query.email, '注册成功', `
        <img src="http://admin.zhouyi.run/assets/logo-8cf4e032.png" alt=""  style="height:auto;display:block;" />
        <p >🎉🎉🎉 <a href="http://www.zhouyi.run/#/">Welcome to ZY.Admin 👻</a></p>
        <p style="font-weight: bold">✨您的验证码：${newCode}  有效期5分钟</p>
        <p style="text-indent: 2em;">祝您工作顺利，心想事成</p>`)
                //session存储验证码
                req.session.code = newCode
                return apiResponse.successResponse(res, "验证码发送成功！请在5分钟内进行验证.");

            }
        } catch (err) {
            console.log(err)
            return apiResponse.ErrorResponse(res, JSON.stringify(err));
        }
    }
]






