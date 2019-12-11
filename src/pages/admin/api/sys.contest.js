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
  deleteContest (id) {
    return request({
      url: `/contest/${id}`,
      method: 'delete'
    })
  },
  getContestList (limit, offset, searchText) {
    let url = `/contest/?limit=${limit}&offset=${offset}`
    if (searchText !== '') {
      url += `&search=${searchText}`
    }
    return request({
      url: url,
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
