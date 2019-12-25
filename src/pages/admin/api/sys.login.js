import request from '@/plugin/axiosAdmin'

export function AccountLogin (data) {
  return request({
    url: '/admin-login',
    method: 'post',
    data
  })
}
