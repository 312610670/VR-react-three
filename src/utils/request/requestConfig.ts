import config from 'src/config';
import { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import {
  message
} from 'antd';

interface AxiosRequestConfigExtend extends AxiosRequestConfig {
  showError?: boolean
}

// 后端返回参数类型
export declare interface ServerResponse {
  success: boolean,
  errorCode?: number,  // 老接口
  error_code?: number,  // 新接口
  message: string,
  data: any
}

// 后端接口返回的状态码
const SERVER_STATUS = {
  NOT_AUTH: 401,
}

let _lockAuth = false;

const serverHandles: LooseObject = {
  // 非法请求（可能是token失效，或者账号被删除）重新进入微信登录过程
  [SERVER_STATUS.NOT_AUTH] () {
    // 避免登录失效，多次进入弹窗
    if (_lockAuth) {
      return Promise.reject();
    }

    // // 当前就是登录页，没必要提示以及跳转
    // if (history.location.pathname === '/login') {
    //   return Promise.reject();
    // }

    _lockAuth = true;

    message.error('登录状态失效，请重新登录...', () => {
      _lockAuth = false;
    });

    // 跳转到登录页
    window.location.href = config.getPath('login', `?redirectURL=${window.location.href}`);

    return Promise.reject();
  }
};

function defaultHandler (res: ServerResponse, response: AxiosResponse) {
  const config = response.config as AxiosRequestConfigExtend;

  console.error(res);

  // 若当前请求带上showError = false，则默认不提示错误，自己处理
  // 默认 showError 不存在，默认提示
  if (config && config.showError !== false) {
    message.error('未知问题，请稍后再试');
  }

  return Promise.reject({
    message: '未知问题，请稍后再试'
  });
}

/**
 * 服务器请求业务实现拦截器
 * @param res 服务器接口数据
 */
function serverInterceptor (response: AxiosResponse) {
  const res: ServerResponse = response.data;

  if (res && res.success === false) {
    const errorCode = res.errorCode || res.error_code;
    const handler = errorCode ? serverHandles[errorCode] : defaultHandler;
    if (handler && typeof handler === 'function') {
      return handler(res, response);
    }
    return Promise.reject(res);
  }

  return res;
}

// 云采购平台早期接口，需要用到的字段
// 生成混淆校验参数
function createParamToken() {
  const timestrap = `${new Date().getTime()}`;

  return {
    c_nonce: timestrap,
    c_nonce_token: `${timestrap}_${Math.random().toString(32).substr(2)}`
  };
}

const axiosConfig = {
  serverInterceptor,
  token: '',

  init(request: AxiosInstance) {
    request.defaults.withCredentials = true;
    request.defaults.baseURL = config.getPath('api-onlinemeeting');
    request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  },

  getToken () {
    return axiosConfig.token;
  },
  setToken (token: string){
    axiosConfig.token = token;
  },

  // 注入请求的参数
  injectParams (params: any) {
    const composeParams = {
      ...params,
      ...createParamToken(),
    };

    // 若存在token，则注入token
    const token = axiosConfig.getToken();
    if (token) {
      composeParams[token] = token;
    }

    return composeParams;
  }
};


export default axiosConfig;
