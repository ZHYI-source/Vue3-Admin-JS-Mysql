import service from '../server'

// export const ArticleListOne = (data) => {
//     return service.get('/api/public/web/article/list', data)
// }

export const usersList = (data) => {
    return service.post('/v1/user/list', data)
}

// export const ArticleListThree = (data) => {
//     return service.put('/api/public/web/article/list', data)
// }
//
// export const ArticleListFour = (data) => {
//     return service.delete('/api/public/web/article/list', data)
// }
