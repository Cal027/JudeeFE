import base from './base' // 导入接口域名列表
import axios from '@/utils/core/http' // 导入http中创建的axios实例

const problem = {
  // get
  getTags () {
    return axios.get(`${base}/problem_tag/`)
  },
  getProblemWithLimit (limit, offset, tags, searchText, diffs) {
    let url = `${base}/problem/?limit=${limit}&offset=${offset}&is_public=True`
    if (tags.length > 0) {
      url += `&tags=${tags}`
    }
    if (searchText !== '') {
      url += `&keyword=${searchText}`
    }
    if (diffs.length > 0) {
      url += `&diff=${diffs}`
    }
    return axios.get(url)
  },
  getProblem (id) {
    return axios.get(`${base}/problem/${id}`)
  }

  // getProblemWithTags (limit, offset, tagList) {
  //   let tags = ''
  //   let i
  //   for (i = 0; i < tagList.length; i++) {
  //     tags += tagList[i] + '+'
  //   }
  //   return axios.get(`${base}/problem/?limit=${limit}&offset=${offset}&is_public=True&tags=${tags}`)
  // }
}

export default problem
