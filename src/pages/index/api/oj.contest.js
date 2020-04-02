import request from '@/plugin/axiosOJ'

export default {
  getContestWithLimit (limit, offset, searchText, ruleType, status) {
    let url = `/contest/?limit=${limit}&offset=${offset}`
    if (searchText !== '') {
      url += `&search=${searchText}`
    }
    if (ruleType !== '') {
      url += `&rule_type=${ruleType}`
    }
    if (status.length > 0) {
      url += `&status=${status}`
    }
    return request({
      url: url,
      method: 'get'
    })
  },
  getContest (id) {
    return request({
      url: `/contest/${id}`,
      method: 'get'
    })
  },
  joinContestWithPwd (id, password) {
    return request({
      url: `/contest/${id}/join-with-pwd/`,
      method: 'post',
      data: { password: password }
    })
  },
  joinContest (id) {
    return request({
      url: `/contest/${id}/join/`,
      method: 'post'
    })
  },
  getContestAnnouncement (id) {
    return request({
      url: `/contest-announcement/?contest=${id}`,
      method: 'get'
    })
  },
  getContestRankList (id) {
    return request({
      url: `/contest-rank/?contest=${id}`,
      method: 'get'
    })
  }
}
