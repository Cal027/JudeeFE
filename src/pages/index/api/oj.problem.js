import request from '@/plugin/axios'

export default {
  submitCode (data) {
    return request({
      url: '/submit/',
      method: 'post',
      data
    })
  }
}
