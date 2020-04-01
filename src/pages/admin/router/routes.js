import layoutHeaderAside from '@admin/layout/header-aside'
import * as Contest from '@admin/views/contest'
import * as Problem from '@admin/views/problem'
import * as Submission from '@admin/views/submission'
import * as System from '@admin/views/system/system.index'

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
        component: Problem.Problem
      },
      {
        path: 'problem/import',
        name: 'import-problem',
        meta: {
          title: '导入题目',
          auth: true
        },
        component: Problem.ProblemImport
      },
      {
        path: 'problem/edit/:problemID',
        name: 'edit-problem',
        meta: {
          title: '修改题目',
          auth: true
        },
        component: Problem.Problem
      },
      {
        path: 'problems',
        name: 'problem-list',
        meta: { title: '题目管理', auth: true },
        component: Problem.ProblemList
      },
      // 竞赛
      {
        path: 'contest/create',
        name: 'create-contest',
        meta: {
          title: '添加竞赛',
          auth: true
        },
        component: Contest.Contest
      },
      {
        path: 'contest/:contestID/edit',
        name: 'edit-contest',
        meta: {
          title: '修改竞赛',
          auth: true
        },
        component: Contest.Contest
      },
      {
        path: 'contests',
        name: 'contest-list',
        meta: {
          title: '竞赛管理',
          auth: true
        },
        component: Contest.ContestList
      },
      {
        path: 'contest/:contestID/problems',
        name: 'contest-problem-list',
        meta: {
          title: '竞赛题目列表',
          auth: true
        },
        component: Contest.ContestProblemList
      },
      {
        path: 'contest/:contestID/announcement',
        name: 'contest-announcement',
        meta: { title: '竞赛公告', auth: true },
        component: Contest.ContestAnnouncement
      },
      {
        path: 'contest/:contestID/problem/create',
        name: 'create-contest-problem',
        meta: {
          title: '添加竞赛题目',
          auth: true
        },
        component: Problem.Problem
      },
      {
        path: 'contest/:contestID/problem/:problemID/edit',
        name: 'edit-contest-problem',
        meta: {
          title: '修改竞赛题目',
          auth: true
        },
        component: Problem.Problem
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
      {
        path: 'submissions',
        name: 'submission-list',
        meta: {
          title: '评测记录',
          auth: true
        },
        component: Submission.SubmissionList
      },
      {
        path: 'status/:id',
        name: 'submission-detail',
        meta: {
          title: '评测详情',
          auth: true
        },
        component: Submission.SubmissionDetail
      },
      {
        path: 'statistics',
        name: 'statistics',
        meta: {
          title: '统计数据',
          auth: true
        },
        component: _import('statistics/Statistics')
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: System.Log
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: System.Refresh
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: System.Redirect
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
    component: System.Login
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: System.Error404
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
