import request from '@/plugin/axiosAdmin'

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
  },
  updateProblem (id, data) {
    return request({
      url: `/problem/${id}/`,
      method: 'put',
      data
    })
  },
  getContestProblems (contestID) {
    return request({
      url: `/contest/${contestID}/problems`,
      method: 'get'
    })
  },
  getProblemList (limit, offset, searchText) {
    let url = `/problem/?limit=${limit}&offset=${offset}`
    if (searchText !== '') {
      url += `&search=${searchText}`
    }
    return request({
      url: url,
      method: 'get'
    })
  },
  getProblem (id) {
    return request({
      url: `/problem/${id}`,
      method: 'get'
    })
  },
  deleteProblem (id) {
    return request({
      url: `/problem/${id}`,
      method: 'delete'
    })
  },
  deleteContestProblem (cid, data) {
    return request({
      url: `/contest/${cid}/remove-problem/`,
      method: 'post',
      data
    })
  },
  getTestCase (id) {
    return request({
      url: `/test_case_download/${id}`,
      method: 'get',
      responseType: 'blob'
    })
  }
}
