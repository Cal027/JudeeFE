/* eslint-disable */
import axios from 'axios'
import router from '@/pages/index/router'
import {Message} from 'element-ui'
// 默认配置
// axios.defaults.baseURL = process.env.VUE_APP_BASE_URL; // 不同环境下的BASE_URL
// 创建axios实例
var instance = axios.create({ timeout: 1000 * 12 })
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
instance.defaults.withCredentials = true// 实现跨域访问

// 请求拦截
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (localStorage.JWT_TOKEN) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = `JWT ${localStorage.JWT_TOKEN}`
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.push('/')
  router.go(0)
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 * @param other
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      Message({
        message: '401: 未登录状态，跳转登录页',
        type: 'error'
      });
      localStorage.removeItem('JWT_TOKEN')
      localStorage.removeItem('username')
      localStorage.removeItem('nickname')
      localStorage.removeItem('ac_prob')
      toLogin()
      break
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      break
    // 404请求不存在
    case 404:
      Message({
        message: '404请求不存在',
        type: 'error'
      });
      break
    case 500:
      Message({
        message: '500 服务器错误',
        type: 'error'
      });
      break
    default:
      console.log(other)
  }
}

// 响应拦截
instance.interceptors.response.use(
  // 请求成功
  res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
  // 请求失败
  error => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        store.commit('changeNetwork', false);
      } else {
        return Promise.reject(error);
      }
    }
  });


export default instance
