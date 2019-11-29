import request from '@/plugin/axios'

export default {
  getUserList (limit, offset) {
    return request({
      url: `/user?limit=${limit}&offset=${offset}`,
      method: 'get'
    })
  }
}
