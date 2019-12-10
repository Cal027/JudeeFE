import request from '@/plugin/axiosAdmin'

export default {
  getUserList (limit, offset) {
    return request({
      url: `/user?limit=${limit}&offset=${offset}`,
      method: 'get'
    })
  }
}
