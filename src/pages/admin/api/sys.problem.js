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
  getProblemList (limit, offset, searchText) {
    let url = `/problem/?limit=${limit}&offset=${offset}`
    if (searchText !== '') {
      url += `&keyword=${searchText}`
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
  getTestCase (id) {
    return request({
      url: `/test_case_download/${id}`,
      method: 'get',
      responseType: 'blob'
    })
  }

}
