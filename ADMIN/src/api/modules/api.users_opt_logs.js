import service from '../server'

export const users_opt_logsList = (data) => {
    return service.post('/v1/sys/optLog/list', data)
}
export const users_opt_logsCreate = (data) => {
    return service.post('/v1/sys/optLog/create', data)
}
export const users_opt_logsUpdate = (data) => {
    return service.post('/v1/sys/optLog/update', data)
}
export const users_opt_logsDelete = (data) => {
    return service.post('/v1/sys/optLog/delete', data)
}
export const users_opt_logsDeleteAll = (data) => {
    return service.post('/v1/sys/optLog/deleteAll', data)
}
// 导出需要指定响应类型未blob
export const users_opt_logsExport = (data) => {
    return service.post('/v1/sys/optLog/export', data,null,'blob')
}
// 导入
export const users_opt_logsImport = (data) => {
    return service.post('/v1/sys/optLog/import', data)
}
// 导出模板
export const users_opt_logsDownloadTemplate = (data) => {
    return service.post('/v1/sys/optLog/downloadTemplate', data,null,'blob')
}




