// 此文件功能  
// import config from 'src/config'

// import { message } from 'antd'

// export declare interface ServerResponse {

// }

// 后端返回数据结构
// {
//   success: boolean;
//   errorCode: Number;
//   message: String;
//   data:any;
// }

// 后端返回状态码

// const SERVER_STATUS = {
//   NOT_AUTH: 401
// };

// let _lockAuth = false
// const serverHandles = {
//     // 没有用户信息
//   [SERVER_STATUS.NOT_AUTH] () {
//     // 避免多次登录
//     if (_lockAuth) {
//       return Promise.reject()
//     }

//     _lockAuth = true
//     message.error('登录失败，重新登录', () => {
//       _lockAuth = false
//     });

//     // 跳转登录页
//     window.location.href = config.getPath(
//       'login',
//       `?redirectorURL=${window.location.href}`
//     )
//   }
// }

// function defaultHander (res, response) {
//                   //服务器返回  axios 返回
//   // const = response.config as axios
//   console.error(res)

//   // 若请求带上showError = false 则不提示错误
//   if (config && config.showError !== false) {
//     message.error(res.message || 'cuowu tishi ')
//   }

//   return Promise.reject({
//     ...res,
//     message: res.message 
//   })
// }

// function createPramTOken () {
//   return {
//     c_nonce: '',
//     c_nonce_token: ''
//   }
// }

// 服务器请求拦截
function serverInterceptor (response) {
  const res = response.data
  return res
}


const axiosConfig = {
  serverInterceptor,
  token: ' ',
  
  init (request) {
    // 请求携带cookie
    request.defaults.withCredentials = true;
    // request.default.baseUrl = '';
    // request.default.headers.post['Content-type'] = 'application/x-www-form-urlencoded';
  },
  getToken () {
    return axiosConfig.token;
  },
  setToken (token) {
    axiosConfig.token = token 
  },
  injectParams (params) {
    const composeParams = {
      ...params,
      // ...createPramTOken()
    };
    // 有token 则注入
    const token = axiosConfig.getToken();
    if (token) {
      composeParams[token] = token;
    }
    return composeParams
  }
}
export default axiosConfig
