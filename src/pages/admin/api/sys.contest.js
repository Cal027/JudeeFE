import request from '@/plugin/axiosAdmin'

export default {
  addContest (data) {
    return request({
      url: '/contest/',
      method: 'post',
      data
    })
  },
  getContest (id) {
    return request({
      url: `/contest/${id}`,
      method: 'get'
    })
  },
  addContestProblem (cid, data) {
    return request({
      url: `/contest/${cid}/add-problem/`,
      method: 'post',
      data
    })
  }
}
