import request from '@/plugin/axiosOJ'

export default {
  getRankList (limit, offset) {
    let url = `/get-ranking/?limit=${limit}&offset=${offset}`
    return request.get(url)
  }
}
