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
  deleteProblem (id) {
    return request({
      url: `/problem/${id}`,
      method: 'delete'
    })
  }

}
