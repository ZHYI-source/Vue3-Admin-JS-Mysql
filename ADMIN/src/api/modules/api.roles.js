import service from '../server'

export const rolesList = (data) => {
    return service.post('/v1/sys/role/list', data)
}
export const rolesCreate = (data) => {
    return service.post('/v1/sys/role/create', data)
}
export const rolesUpdate = (data) => {
    return service.post('/v1/sys/role/update', data)
}
export const rolesDelete = (data) => {
    return service.post('/v1/sys/role/delete', data)
}
export const rolesFindOne = (data) => {
    return service.post('/v1/sys/role/findOne', data)
}

