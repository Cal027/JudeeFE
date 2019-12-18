// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
import * as Contest from '@oj/views/contest'

const _import = require('@oj/libs/util.import.' + process.env.NODE_ENV)

const routes = [
  {
    path: '/',
    name: 'home',
    component: _import('Intro')
  },
  {
    path: '/home',
    name: 'intro',
    component: _import('Intro')
  },
  {
    path: '/user/:username',
    name: 'user',
    component: _import('user/UserHome')
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: _import('user/Login')
  },
  {
    path: '/register',
    name: 'register',
    meta: { title: '注册' },
    component: _import('user/Register')
  },
  {
    path: '/tutorial',
    name: 'Tutorial',
    meta: { title: '教程' },
    component: _import('tutorial/Tutorial')
  },
  {
    path: '/tutorial/oi-wiki',
    name: 'OiWiki',
    meta: { title: 'OI-WiKi' },
    component: _import('tutorial/OiWiki')
  },
  {
    path: '/setting/profile',
    name: 'profile',
    meta: { title: '个人信息', auth: true },
    component: _import('setting/ProfileSetting')
  },
  {
    path: '/setting/password',
    name: 'password',
    meta: { title: '修改密码', auth: true },
    component: _import('setting/PasswordSetting')
  },
  // 题目相关
  {
    path: '/problem',
    name: 'ProblemList',
    meta: { title: '题目列表' },
    component: _import('problem/ProblemList')
  },
  {
    path: '/problem/:id',
    name: 'ProblemDetail',
    meta: { title: '题目详情' },
    component: _import('problem/ProblemDetail'),
    children: [
      {
        path: 'submissions',
        name: 'ProblemSubmissions',
        meta: { auth: true },
        component: _import('submission/SubmissionList')
      },
      {
        path: 'submissions-mine',
        name: 'ProblemSubmissionsMine',
        meta: { auth: true },
        component: _import('submission/SubmissionList')
      }
    ]
  },
  // 竞赛相关
  {
    path: '/contest',
    name: 'Contest-list',
    meta: { title: '竞赛列表', auth: true },
    component: Contest.ContestList
  },
  {
    path: '/contest/:contestID',
    name: 'Contest-detail',
    meta: { title: '竞赛详情', auth: true },
    component: Contest.ContestDetail,
    children: [
      {
        path: 'problems',
        name: 'Contest-problems',
        meta: { auth: true },
        component: Contest.ContestProblemList
      },
      {
        path: 'problem/:id/',
        name: 'Contest-problem-detail',
        meta: { auth: true },
        component: _import('problem/ProblemDetail')
      },
      {
        path: 'announcement',
        name: 'Contest-announcement',
        meta: { auth: true },
        component: Contest.ContestAnnouncement
      },
      {
        path: 'submissions-mine',
        name: 'ContestSubmissionsMine',
        meta: { auth: true },
        component: _import('submission/SubmissionList')
      },
      {
        path: 'rank',
        name: 'Contest-rank',
        meta: { auth: true },
        component: Contest.ContestRank
      }
    ]
  },
  // 评测记录相关
  {
    path: '/status',
    name: 'submission-list',
    meta: { title: '全部评测记录', auth: true },
    component: _import('submission/SubmissionList')
  },
  {
    path: '/status/:id/',
    name: 'submission-detail',
    meta: { title: '评测详情', auth: true },
    component: _import('submission/SubmissionDetail')
  },
  {
    path: '/rank',
    name: 'rank',
    meta: { title: '排名' },
    component: _import('rank/Rank')
  }
]

export default routes
