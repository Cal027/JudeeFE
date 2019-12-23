import request from '@/plugin/axiosAdmin'

export default {
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
  getSubmissionList (limit, offset, username, language, problem, result, contest = '') {
    let url = ``
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
    return request.get(url)
  },
  rejudgeSubmission (idList) {
    // TODO Rejudge的API
    return request.post('', idList)
  }
}
