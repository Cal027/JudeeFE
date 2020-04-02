import request from '@/plugin/axiosOJ'

export default {
  getSubmissionList (limit, offset, username, language, problem, result, myself, contest = '') {
    let url = ''
    if (contest !== '') {
      url += `/contest-submission/?limit=${limit}&offset=${offset}&contest=${contest}`
    } else {
      url += `/submission/?limit=${limit}&offset=${offset}`
    }
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
    return request({
      url: url,
      method: 'get'
    })
  },
  getSubmission (id, contest) {
    if (contest) {
      return request({
        url: `/contest-submission/${id}`,
        method: 'get'
      })
    } else {
      return request({
        url: `/submission/${id}`,
        method: 'get'
      })
    }
  },
  setSharing (id, shared) {
    return request({
      url: `/sharing/${id}/`,
      method: 'put',
      data: { shared: shared }
    })
  }
}
