import layoutHeaderAside from '@admin/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@admin/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          auth: true
        },
        component: _import('system/index')
      },
      // 题目
      {
        path: 'problem/create',
        name: 'create-problem',
        meta: {
          title: '添加题目',
          auth: true
        },
        component: _import('problem/Problem')
      },
      {
        path: 'problem/edit/:problemID',
        name: 'edit-problem',
        meta: {
          title: '修改题目',
          auth: true
        },
        component: _import('problem/Problem')
      },
      {
        path: 'problems',
        name: 'problem-list',
        meta: { title: '题目管理' },
        component: _import('problem/ProblemList')
      },
      // 竞赛
      {
        path: 'contest/create',
        name: 'create-contest',
        meta: {
          title: '添加竞赛',
          auth: true
        },
        component: _import('contest/Contest')
      },
      {
        path: 'contest/:contestID/edit',
        name: 'edit-contest',
        meta: {
          title: '修改竞赛',
          auth: true
        },
        component: _import('contest/Contest')
      },
      {
        path: 'contest/:contestID/problems',
        name: 'contest-problem-list',
        meta: {
          title: '竞赛题目列表',
          auth: true
        },
        component: _import('problem/ProblemList')
      },
      {
        path: 'contest/:contestID/problem/create',
        name: 'create-contest-problem',
        meta: {
          title: '添加竞赛题目',
          auth: true
        },
        component: _import('problem/Problem')
      },
      {
        path: 'contest/:contestID/problem/:problemID/edit',
        name: 'edit-contest-problem',
        meta: {
          title: '修改竞赛题目',
          auth: true
        },
        component: _import('problem/Problem')
      },
      // 用户
      {
        path: 'user',
        name: 'user',
        meta: {
          title: '用户管理',
          auth: true
        },
        component: _import('user/User')
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
