
import axios from 'axios';
 
/** 
 * @method restful请求封装
 * @param api
 * @param {string} api.url 后台地址
 * @param {string} api.type 请求方式 get post put delete
 * @param {boolean} api.placeholder 是否启用占位符替换 true启用 false不启用 启用后会自动匹配url上的占位符与入参进行替换
 * @param {boolean} api.formData 是否启用formData数据格式如参 true启用 false不启用 启用后会自动将入参格式转为formData格式，仅在post请求有效
 * @param {object}request 请求参数 默认为空对象
*/
// 期望使用方式
// server.get('', {})

  // 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  })




// module.exports = {
//   get: get,
//   post: post,
//   put: put,
//   fudelete: fudelete
// }

class req {

  // 封装get方法
  get (url, params) {
    return new Promise((resolve, reject) =>{
        axios.get(url, params).then(res =>{
            resolve(res.data);
        }).catch(err =>{
            reject(err.data);
        })
    });
  }
  // 封装post方法
  post(url, params){
    return new Promise((resolve, reject) =>{
        axios.post(url, params).then(res =>{
            resolve(res.data);
        }).catch(err =>{
            reject(err.data);
        })
    });
  }
  
  // 封装put方法
  put(url, params){
    return new Promise((resolve, reject) =>{
        axios.post(url, params).then(res =>{
            resolve(res.data);
        }).catch(err =>{
            reject(err.data);
        })
    });
  }
  
  // 封装post方法
  fnDelete(url, params){
    return new Promise((resolve, reject) =>{
        axios.delete(url, params).then(res =>{
            resolve(res.data);
        }).catch(err =>{
            reject(err.data);
        })
    });
  }
}


let server = new req()
export default  server;