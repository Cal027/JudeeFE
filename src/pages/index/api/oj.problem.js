import request from '@/plugin/axiosOJ'

export default {
  submitCode (data) {
    return request({
      url: '/submit/',
      method: 'post',
      data
    })
  },
  getContestProblems (contestID) {
    return request({
      url: `/contest/${contestID}/problems`,
      method: 'get'
    })
  }
}
