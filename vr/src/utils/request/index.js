import axios from 'axios'
import requestConfig from './requestConfig'

const HTTP_STATUS = {}

// 请求初始化配置
const request = axios.create()
requestConfig.init(request)

request.interceptors.request.use(req => {
    switch (req.method) {
      case 'get':
        req.params = requestConfig.injectParams(req.params)
        break;
        case 'post':
      default:
        req.data = requestConfig.injectParams(req.data)
        break;
  }
  return req;
},
// 对请求错误处理
  function (error) {
  return Promise.reject(error);
})


request.interceptors.response.use((res) => {
  switch (res.status) {
    
  }
  return {}

}, function (error) {
    return Promise.reject(error)
})

export default request