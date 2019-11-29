import request from '@/plugin/axios'

export default {
  getTags () {
    return request({
      url: '/problem_tag',
      method: 'get'
    })
  },
  addProblem (data) {
    return request({
      url: '/problem/',
      method: 'post',
      data
    })
  }

}
