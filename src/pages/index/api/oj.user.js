import request from '@/plugin/axiosOJ'

export default {
  register (data) {
    return request.post('/register/', data)
  },
  getUserInfo (username) {
    return request.get(`userdata/${username}`)
  },
  updateUserProfile (username, newProfile) {
    return request({
      url: `/change_profile/${username}/`,
      method: 'put',
      newProfile
    })
  },
  changePwd (data) {
    return request.put('/change_pwd', data)
  },
  updateRanking () {
    return request({
      url: `/update-ranking/`,
      method: 'get'
    })
  }
}

export function Login (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function setLoginInfo (data) {
  return request.post('setlogindata', data)
}
