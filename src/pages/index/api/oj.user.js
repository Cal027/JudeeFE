import request from '@/plugin/axiosOJ'

export default {
  register (data) {
    return request.post('/register/', data)
  },
  getUserInfo (username) {
    return request.get(`/user/${username}`)
  },
  getUserData (username) {
    return request.get(`/userdata/${username}`)
  },
  updateUserProfile (username, newProfile) {
    return request.patch(`/change_profile/${username}/`, newProfile)
  },
  changePwd (data) {
    return request.put('/change_pwd', data)
  },
  updateRanking (username) {
    let url = '/update-ranking/'
    if (username) {
      url += `?username=${username}`
    }
    return request({
      url: url,
      method: 'get'
    })
  },
  getStatisticInfo (username, offset) {
    let url = `/statistics/?username=${username}`
    if (offset) {
      url += `&offset=${offset}`
    }
    return request({
      url: url,
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
