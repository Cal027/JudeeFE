import Vue from 'vue'
import VueRouter from 'vue-router'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import Intro from '@oj/views/Intro'
import * as Contest from '@oj/views/contest'
import util from '@/utils/util'

const Login = () => import('@oj/views/user/Login')
const Register = () => import('@oj/views/user/Register')
const User = () => import('@oj/views/user/UserHome')
const Tutorial = () => import('@oj/views/tutorial/Tutorial')
const ProfileSetting = () => import('@oj/views/setting/ProfileSetting')
const PasswordSetting = () => import('@oj/views/setting/PasswordSetting')
const OiWiki = () => import('@oj/views/tutorial/OiWiki')
const ProblemList = () => import('@oj/views/problem/ProblemList')
const ProblemDetail = () => import('@oj/views/problem/ProblemDetail')

Vue.use(VueRouter)

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Intro
  },
  {
    path: '/home',
    name: 'intro',
    component: Intro
  },
  {
    path: '/user/:username',
    name: 'user',
    component: User
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    meta: { title: '注册' },
    component: Register
  },
  {
    path: '/tutorial',
    name: 'Tutorial',
    meta: { title: '教程' },
    component: Tutorial
  },
  {
    path: '/setting/profile',
    name: 'profile',
    meta: { title: '个人信息' },
    component: ProfileSetting
  },
  {
    path: '/setting/password',
    name: 'password',
    meta: { title: '修改密码' },
    component: PasswordSetting
  },
  {
    path: '/tutorial/oi-wiki',
    name: 'OiWiki',
    meta: { title: 'OI-WiKi' },
    component: OiWiki
  },
  {
    path: '/problem',
    name: 'ProblemList',
    meta: { title: '题目列表' },
    component: ProblemList
  },
  { path: '/problem/:id',
    name: 'ProblemDetail',
    meta: { title: '题目详情' },
    component: ProblemDetail
  },
  {
    path: '/contest',
    name: 'Contest-list',
    meta: { title: '竞赛列表' },
    component: Contest.ContestList
  },
  {
    path: '/contest/:contestID',
    name: 'Contest-detail',
    meta: { title: '竞赛详情' },
    component: Contest.ContestDetail,
    children: [
      {
        path: 'problems',
        name: 'Contest-problems',
        component: Contest.ContestProblemList
      },
      {
        path: 'problem/:id/',
        name: 'Contest-problem-detail',
        component: ProblemDetail
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.afterEach(to => {
  // 进度条结束
  NProgress.done()
  // 修改标题
  util.title(to.meta.title)
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

export default router
