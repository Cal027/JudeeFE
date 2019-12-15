import request from '@/plugin/axiosAdmin'

export default {
  getUserList (limit, offset) {
    return request({
      url: `/user?limit=${limit}&offset=${offset}`,
      method: 'get'
    })
  },
  bulkRegister (data) {
    return request({
      url: `/bulk-registration/`,
      method: 'post',
      data
    })
  },
  downloadUserList (id) {
    return request({
      url: `/bulk-registration/?file_id=${id}`,
      method: 'get',
      responseType: 'blob'
    })
  }
}
