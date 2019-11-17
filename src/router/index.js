import Vue from 'vue'
import Router from 'vue-router'

import main from '../components/main'
import problem from '../components/mainpage/problem'
import statue from '../components/mainpage/statue'
import contest from '../components/mainpage/contest'
import contestdetail from '../components/contest/contestdetail'
import problemdetail from '../components/problem/problemdetail'
import rank from '../components/mainpage/rank'
import admin from '../components/mainpage/admin'
import billboard from '../components/mainpage/billboard'
import blog from '../components/mainpage/blog'
import mbcode from '../views/tutorial/code'
import viewcode from '../views/tutorial/mbcode/viewcode'
import viewcodedetail from '../views/tutorial/mbcode/viewcodedetail'
import codeedit from '../views/tutorial/mbcode/codeedit'
import OiWiki from '../views/tutorial/OiWiki'

//懒加载
const Setting = () => import('../views/setting/Settings');
const ProfileSetting = () => import('../views/setting/ProfileSetting');
const Login = () => import('../views/user/Login');
const Register = () => import('../views/user/Register');
const Tutorial = () => import('../views/tutorial/Tutorial');
const todolist = () => import('../components/utils/todolist');
const User = () => import('../views/user/UserHome');


Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: main
    },
    {
      path: '/problem',
      name: 'problem',
      component: problem,
    },
    {
      path: '/problemdetail',
      name: 'problemdetail',
      component: problemdetail,
    },
    {
      path: '/main',
      name: 'main',
      component: main
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin
    },
    {
      path: '/statue',
      name: 'statue',
      component: statue
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting
    },
    {
      path: '/setting/profile',
      name: 'profile',
      component: ProfileSetting
    },
    {
      path: '/contest',
      name: 'contest',
      component: contest
    },
    {
      path: '/contest/:contestID',
      name: 'contestdetail',
      component: contestdetail,
    },
    {
      path: '/rank',
      name: 'rank',
      component: rank,
    },
    {
      path: '/billboard',
      name: 'billboard',
      component: billboard,
    },
    {
      path: '/blog',
      name: 'blog',
      component: blog,
    },
    {
      path: '/tutorial',
      name: 'Tutorial',
      component: Tutorial,
    },
    {
      path: '/tutorial/code',
      name: 'mbcode',
      component: mbcode,
    },
    {
      path: '/tutorial/mbcode/:username',
      name: 'viewcode',
      component: viewcode,
    },
    {
      path: '/tutorial/mbcodedetail/:codeID',
      name: 'viewcodedetail',
      component: viewcodedetail,
    },
    {
      path: '/tutorial/mbcodeedit',
      name: 'codeedit',
      component: codeedit,
    },
    {
      path: '/tutorial/oi-wiki',
      name: 'OiWiki',
      component: OiWiki,
    },
    {
      path: '/todolist',
      name: 'todolist',
      component: todolist,
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
    }
  ]
})
