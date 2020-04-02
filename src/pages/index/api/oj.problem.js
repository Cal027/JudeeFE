import request from '@/plugin/axiosOJ'

export default {
  submitCode (data) {
    return request({
      url: '/submit/',
      method: 'post',
      data
    })
  },
  getProblemWithLimit (limit, offset, tags, searchText, diffs) {
    let url = `/problem/?limit=${limit}&offset=${offset}&is_public=True`
    if (tags.length > 0) {
      url += `&tags=${tags}`
    }
    if (searchText !== '') {
      url += `&search=${searchText}`
    }
    if (diffs.length > 0) {
      url += `&diff=${diffs}`
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
  getTags () {
    return request({
      url: '/problem_tag',
      method: 'get'
    })
  },
  getContestProblems (contestID) {
    return request({
      url: `/contest/${contestID}/problems`,
      method: 'get'
    })
  }
}
