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
  editContest (id, data) {
    return request({
      url: `/contest/${id}/`,
      method: 'put',
      data
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
  },
  // 公告相关
  getContestAnnouncement (id) {
    return request({
      url: `/contest-announcement/?contest=${id}`,
      method: 'get'
    })
  },
  updateAnnouncement (id, data) {
    return request({
      url: `/contest-announcement/${id}/`,
      method: 'put',
      data
    })
  },
  addAnnouncement (data) {
    return request({
      url: '/contest-announcement/',
      method: 'post',
      data
    })
  },
  deleteAnnouncement (id) {
    return request({
      url: `/contest-announcement/${id}`,
      method: 'delete'
    })
  }
}
