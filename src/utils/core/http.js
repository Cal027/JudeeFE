/* eslint-disable */
import axios from 'axios';
import cookies from './cookie.js'

// 默认配置
// axios.defaults.baseURL = process.env.VUE_APP_BASE_URL; // 不同环境下的BASE_URL
// 创建axios实例
var instance = axios.create({    timeout: 1000 * 12});
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


// 请求拦截
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    if (localStorage.JWT_TOKEN) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = `token ${localStorage.JWT_TOKEN}`;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// 响应拦截
instance.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

// get请求
export async function get(url, params = {}) {
    try {
        let res = await axios.get(url, params);
        return new Promise((resolve, reject) => {
            resolve(res.data);
        })
    } catch (err) {
        console.log(err);
    }
}
export default instance;
