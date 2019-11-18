import base from './base'; // 导入接口域名列表
// import axios from '@/utils/http'; // 导入http中创建的axios实例
import axios from 'axios';

const user = {
  // get
  logout(){
    return axios.get(`${base}/logout`);
  },
  getUserInfo(username){
    return axios.get(`${base}/user/`+username);
  },
  getUserData(username){
    return axios.get(`${base}/userdata/`+username);

  },
  // post提交
  login(params) {
    return axios.post(`${base}/login`,params);
  },
  register(params) {
    return axios.post(`${base}/register`,params);
  },
  setLoginData(params) {
    return axios.post(`${base}/setlogindata`,params);
  },
  updateUserProfile(username, new_profile) {
    return axios.put(`${base}/change_profile`+username+'/', new_profile);

  }


};

export default user;
