import request from '@/plugin/axiosAdmin'

export default {
  getOverall () {
    return request.get('/overall')
  },
  getSubmissionStatistics (offset = null) {
    if (offset) {
      return request.get(`/admin-submission/?offset=${offset}`)
    } else {
      return request.get('/admin-submission')
    }
  },
  getSubmissionResults (offset = null) {
    if (offset) {
      return request.get(`/recent-submission/?offset=${offset}`)
    } else {
      return request.get('/recent-submission')
    }
  },
  getLoginData (offset = null) {
    if (offset) {
      return request.get(`/admin-login-data/?offset=${offset}`)
    } else {
      return request.get('/admin-login-data')
    }
  }
}
