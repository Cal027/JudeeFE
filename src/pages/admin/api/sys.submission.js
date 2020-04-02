import request from '@/plugin/axiosAdmin'

export default {
  getSubmission (id) {
    return request({
      url: `/manager-submission/${id}`,
      method: 'get'
    })
  },
  getSubmissionList (limit, offset, username, language, problem, result, contest) {
    let url = ''
    url += `/manager-submission/?limit=${limit}&offset=${offset}`

    if (username !== '') {
      url += `&username=${username}`
    }
    if (language !== '') {
      url += '&language=' + encodeURIComponent(language)
    }
    if (result !== '') {
      url += `&result=${result}`
    }
    if (problem !== '') {
      url += `&problem=${problem}`
    }
    if (contest !== '') {
      url += `&contest=${contest}`
    }
    return request.get(url)
  },
  rejudgeSubmission (idList) {
    return request.post('rejudge/', { submissions: idList })
  }
}
