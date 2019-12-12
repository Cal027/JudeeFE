import request from '@/plugin/axiosOJ'

export default {
  getProblemWithLimit (limit, offset, username, language, problem) {
    let url = `/submission/?limit=${limit}&offset=${offset}`
    if (username !== '') {
      url += `&username=${username}`
    }
    if (language !== '') {
      url += `&language=${language}`
    }
    if (problem !== '') {
      url += `&problem=${problem}`
    }
    return request({
      url: url,
      method: 'get'
    })
  },
  getSubmission (id) {
    return request({
      url: `/submission/${id}`,
      method: 'get'
    })
  }
}
