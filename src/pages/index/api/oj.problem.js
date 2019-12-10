import request from '@/plugin/axiosOJ'

export default {
  submitCode (data) {
    return request({
      url: '/submit/',
      method: 'post',
      data
    })
  }
}
