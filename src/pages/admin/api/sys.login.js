import request from '@/plugin/axiosAdmin'

export function AccountLogin (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
