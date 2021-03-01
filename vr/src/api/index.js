// 获取项目列表
// https://vr-api.wangjunmei.com/test/projects
import server from '../utils/request/index'

// const server = new axios()
// axiosConfig
// 获取列表数据
export const getProjects = ()=> server.get('https://vr-api.wangjunmei.com/project/list')

// 获取单个项目数据
// export const getProjectData = server.get('https://vr-api.wangjunmei.com/test/project/list', {id:""})

// 添加项目
export const addProject = (data) => server.post('https://vr-api.wangjunmei.com/project/add', data)


// 获取秘钥
export const getKey = () => server.get('https://vr-api.wangjunmei.com/sts/tempkey')