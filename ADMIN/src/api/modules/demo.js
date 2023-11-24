import service from '../server'

// 下面地址都是请求示例

export const ArticleListOne = (data) => {
    return service.get('/api/public/web/article/list', data)
}

export const ArticleListTwo = (data) => {
    return service.post('/api/public/web/article/list', data)
}

export const ArticleListThree = (data) => {
    return service.put('/api/public/web/article/list', data)
}

export const ArticleListFour = (data) => {
    return service.delete('/api/public/web/article/list', data)
}
