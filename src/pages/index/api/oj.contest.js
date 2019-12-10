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
  }
}
