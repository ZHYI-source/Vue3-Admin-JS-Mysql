import service from '../server'

export const usersList = (data) => {
    return service.post('/v1/sys/user/list', data)
}
export const usersCreate = (data) => {
    return service.post('/v1/sys/user/create', data)
}
export const usersUpdate = (data) => {
    return service.post('/v1/sys/user/update', data)
}
export const usersDelete = (data) => {
    return service.post('/v1/sys/user/delete', data)
}
// 重置密码
export const usersReset = (data) => {
    return service.post('/v1/sys/user/reset', data)
}
// 获取用户信息
export const usersFindOne = (data) => {
    return service.post('/v1/sys/user/findOne', data)
}


