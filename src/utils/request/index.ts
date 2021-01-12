import axios, { AxiosResponse } from 'axios';
import requestConfig from './requestConfig';

// HTTP 返回的状态码
const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  CLIENT_ERROR: 400,
  AUTHENTICATE: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

// 初始化请求配置
const request = axios.create();
requestConfig.init(request);


request.interceptors.request.use((req) => {
  switch (req.method) {
    case 'get':
      req.params = requestConfig.injectParams(req.params);
      break;
    case 'post':
    default:
      req.data = requestConfig.injectParams(req.data);
      break;
  }
  return req;
}, function (error) {
  return Promise.reject(error);
});

request.interceptors.response.use((response: AxiosResponse) => {
  switch(response.status) {
    case HTTP_STATUS.NOT_FOUND:
      return Promise.reject('请求资源不存在');
    case HTTP_STATUS.BAD_GATEWAY:
      return Promise.reject('服务端出现了问题');
    case HTTP_STATUS.FORBIDDEN:
      return Promise.reject('没有权限访问');
    case HTTP_STATUS.AUTHENTICATE:
      return Promise.reject('需要鉴权');
    case HTTP_STATUS.SERVER_ERROR:
      return Promise.reject('接口500');
    case HTTP_STATUS.SUCCESS:
      // 业务模型判断
      if (requestConfig.serverInterceptor) {
        return requestConfig.serverInterceptor(response);
      }

      return response.data;
    default:
      break;
  }
}, function (error) {
  console.error('err', error && error.message);
  // 错误状态拦截，错误码处理
  return Promise.reject(error);
});

export default request;
