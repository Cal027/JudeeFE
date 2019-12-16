import request from '@/plugin/axiosOJ'

export default {
  getSubmissionList (limit, offset, username, language, problem, result, myself, contest = '') {
    let url = `/submission/?limit=${limit}&offset=${offset}`
    if (username !== '') {
      url += `&username=${username}`
    }
    if (language !== '') {
      url = url + '&language=' + encodeURIComponent(language)
    }
    if (result !== '') {
      url += `&result=${result}`
    }
    if (problem !== '') {
      url += `&problem=${problem}`
    }
    if (myself) {
      url += '&myself=true'
    }
    if (contest !== '') {
      url += `&contest=${contest}`
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
