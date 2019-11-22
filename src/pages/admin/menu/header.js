// 菜单 顶栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '常规',
    icon: 'inbox',
    children: [
      { path: '/announce', title: '公告', icon: 'bullhorn' },
      { path: '/judge', title: '评测机', icon: 'steam' },
      { path: '/setting', title: '设置', icon: 'gear' }
    ]
  },
  { path: '/user', title: '用户', icon: 'user-circle-o' },
  {
    title: '题目',
    icon: 'list-ul',
    children: [
      { path: '/add-problem', title: '添加题目', icon: 'plus' },
      { path: '/problem-list', title: '题目列表', icon: 'list-ol' }
    ]
  },
  {
    title: '比赛',
    icon: 'trophy',
    children: [
      { path: '/add-contest', title: '添加比赛', icon: 'plus' },
      { path: '/contest-list', title: '比赛列表', icon: 'list-ol' }
    ]
  },
  { path: '/statistics', title: '统计', icon: 'line-chart' }
]
