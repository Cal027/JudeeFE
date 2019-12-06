import Vue from 'vue'
import VueRouter from 'vue-router'

import Intro from '@oj/views/Intro'

const Login = () => import('@oj/views/user/Login')
const Register = () => import('@oj/views/user/Register')
const User = () => import('@oj/views/user/UserHome')
const Tutorial = () => import('@oj/views/tutorial/Tutorial')
const ProfileSetting = () => import('@oj/views/setting/ProfileSetting')
const PasswordSetting = () => import('@oj/views/setting/PasswordSetting')
const OiWiki = () => import('@oj/views/tutorial/OiWiki')
const ProblemList = () => import('@oj/views/problem/ProblemList')
const ProblemDetail = () => import('@oj/views/problem/ProblemDetail')
const ContestList = () => import('@oj/views/contest/ContestList')

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
    name: 'intro',
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
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/tutorial',
    name: 'Tutorial',
    component: Tutorial
  },
  {
    path: '/setting/profile',
    name: 'profile',
    component: ProfileSetting
  },
  {
    path: '/setting/password',
    name: 'password',
    component: PasswordSetting
  },
  {
    path: '/tutorial/oi-wiki',
    name: 'OiWiki',
    component: OiWiki
  },
  {
    path: '/problem',
    name: 'ProblemList',
    component: ProblemList
  },
  { path: '/problem/:id',
    name: 'ProblemDetail',
    component: ProblemDetail
  },
  {
    path: '/contests',
    name: 'ContestsList',
    component: ContestList
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
