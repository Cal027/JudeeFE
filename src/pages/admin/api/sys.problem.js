import request from '@/plugin/axios'

export default {
  getTags () {
    return request({
      url: '/login',
      method: 'post'
    })
  }
}
