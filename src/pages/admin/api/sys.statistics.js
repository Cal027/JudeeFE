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
  }
}
