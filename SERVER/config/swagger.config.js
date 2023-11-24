/**
 *@author ZY
 *@date 2023/11/14 21:00
 *@Description: 配置swagger
 */

const options = {
    swaggerDefinition: {
        info: {
            title: 'MealPass-API',
            version: '1.0.0',
            description: `基于Express + Mysql`
        },
        host: `localhost:3000`,
        basePath: '/',
        produces: ['application/json', 'application/xml'],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'authorization',
                description: 'token'
            }
        }
    },
    route: {
        url: '/swagger',//打开swagger文档页面地址
        docs: '/swagger.json' //swagger文件 api
    },
    basedir: __dirname, //app absolute path

    files: [  //在那个文件夹下面收集注释
        // '../routes/**/**/*.js',
        '../controllers/**/**/*.js',
    ]
}

module.exports = options
