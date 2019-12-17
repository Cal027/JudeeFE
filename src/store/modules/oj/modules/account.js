import { Login, setLoginInfo } from '@oj/api/oj.user'
import { getBrowserInfo } from '@/utils/getBroswerInfo'
import { Message, MessageBox } from 'element-ui'
import util from '@/utils/util'
import router from '@oj/router'

// 注释见store/modules/d2admin/modules/account.js
export default {
  namespaced: true,
  actions: {
    // 登录
    login ({ dispatch }, {
      username = '',
      password = ''
    } = {}) {
      return new Promise((resolve, reject) => {
        Login({ username, password }).then(async res => {
          if (res === 'userError') {
            Message.error('用户名或邮箱未注册')
          } else if (res === 'pwdError') {
            Message.error('密码错误')
          } else {
            const info = getBrowserInfo().toString()
            setLoginInfo({
              username: res.username,
              msg: info
            }).then(async _ => {
              util.cookies.set('tokenOJ', res.token)
              await dispatch('oj/user/set', {
                username: res.username,
                nickname: res.nickname,
                type: res.type,
                ac_prob: res.ac_prob
              }, { root: true })
              await dispatch('load')
              resolve()
            })
          }
        }).catch(err => {
          console.log('err: ', err)
          reject(err)
        })
      })
    },
    // 注销
    logout ({ dispatch }) {
      async function logout () {
        // 删除cookie
        util.cookies.remove('tokenOJ')
        // 清空 vuex 用户信息
        await dispatch('oj/user/set', {}, { root: true })
        // 跳转路由
        router.push({
          name: 'home'
        })
      }
      MessageBox.confirm('确定要注销当前用户吗', '注销用户', {
        type: 'warning'
      }).then(() => {
        logout().then(_ => {
          Message({
            message: '注销成功！',
            type: 'success'
          })
        })
      }).catch(() => {
        Message({
          message: '取消注销'
        })
      })
    },
    load ({ dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 加载用户名
        await dispatch('oj/user/load', null, { root: true })
        // DB -> store 持久化数据加载颜色设置
        await dispatch('oj/color/load', null, { root: true })
        resolve()
      })
    }
  }
}
