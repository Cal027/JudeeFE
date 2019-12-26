import Vue from 'vue'
import VueRouter from 'vue-router'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import util from '@/utils/util'
import { Message } from 'element-ui'

import routes from './routes'
import store from '@/store'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.matched.some(r => r.meta.auth)) {
    const token = util.cookies.get('tokenOJ')
    if (token && token !== 'undefined') {
      next()
    } else {
      Message({
        message: '未授权，请登录',
        type: 'error',
        duration: 1000
      })
      if (store.state.oj.user.info) {
        store.dispatch('oj/account/forceLogout')
      }
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
      NProgress.done()
    }
  } else {
    next()
  }
})

router.afterEach(to => {
  // 进度条结束
  NProgress.done()
  // 修改标题
  util.title(to.meta.title)
})

export default router
