// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
import * as Contest from '@oj/views/contest'

const _import = require('@oj/libs/util.import.' + process.env.NODE_ENV)

// WebpackChunk
const ProblemList = () => import(/* webpackChunkName: "oj-problem" */ '@oj/views/problem/ProblemList')
const ProblemDetail = () => import(/* webpackChunkName: "oj-problem" */ '@oj/views/problem/ProblemDetail')

const SubmissionList = () => import(/* webpackChunkName: "oj-submission" */ '@oj/views/submission/SubmissionList')
const SubmissionDetail = () => import(/* webpackChunkName: "oj-submission" */ '@oj/views/submission/SubmissionDetail')

const ProfileSetting = () => import(/* webpackChunkName: "oj-profile" */ '@oj/views/setting/ProfileSetting')
const PasswordSetting = () => import(/* webpackChunkName: "oj-profile" */ '@oj/views/setting/PasswordSetting')
const UserHome = () => import(/* webpackChunkName: "oj-profile" */ '@oj/views/user/UserHome')
const Login = () => import(/* webpackChunkName: "oj-profile" */ '@oj/views/user/Login')
const Register = () => import(/* webpackChunkName: "oj-profile" */ '@oj/views/user/Register')

const routes = [
  {
    path: '/',
    name: 'home',
    component: require('@oj/views/Intro').default
  },
  {
    path: '/user/:username',
    name: 'user',
    component: UserHome
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
    name: 'OiWiki',
    meta: { title: '教程' },
    component: _import('tutorial/OiWiki')
  },
  {
    path: '/setting/profile',
    name: 'profile',
    meta: { title: '个人信息', auth: true },
    component: ProfileSetting
  },
  {
    path: '/setting/password',
    name: 'password',
    meta: { title: '修改密码', auth: true },
    component: PasswordSetting
  },
  // 题目相关
  {
    path: '/problem',
    name: 'ProblemList',
    meta: { title: '题目列表' },
    component: ProblemList
  },
  {
    path: '/problem/:id',
    name: 'ProblemDetail',
    meta: { title: '题目详情' },
    component: ProblemDetail,
    children: [
      {
        path: 'submissions',
        name: 'ProblemSubmissions',
        meta: { auth: true },
        component: SubmissionList
      },
      {
        path: 'submissions-mine',
        name: 'ProblemSubmissionsMine',
        meta: { auth: true },
        component: SubmissionList
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
        component: ProblemDetail
      },
      {
        path: 'announcement',
        name: 'Contest-announcement',
        meta: { auth: true },
        component: Contest.ContestAnnouncement
      },
      {
        path: 'submissions-mine',
        name: 'Contest-submissions-mine',
        meta: { auth: true },
        component: SubmissionList
      },
      {
        path: 'rank',
        name: 'Contest-rank',
        meta: { auth: true },
        component: Contest.ContestRank
      },
      {
        path: 'status/:id',
        name: 'Contest-submission-status',
        meta: { auth: true },
        component: Contest.ContestSubmissionDetail
      }
    ]
  },
  // 评测记录相关
  {
    path: '/status',
    name: 'submission-list',
    meta: { title: '全部评测记录', auth: true },
    component: SubmissionList
  },
  {
    path: '/status/:id/',
    name: 'submission-detail',
    meta: { title: '评测详情', auth: true },
    component: SubmissionDetail
  },
  {
    path: '/rank',
    name: 'rank',
    meta: { title: '排名' },
    component: _import('rank/Rank')
  }
]

export default routes
