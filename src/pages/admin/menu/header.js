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
      { path: '/problem/create', title: '添加题目', icon: 'plus' },
      { path: '/problem/import', title: '导入题目', icon: 'cloud-upload' },
      { path: '/problems', title: '题目管理', icon: 'list-ol' }
    ]
  },
  {
    title: '竞赛',
    icon: 'trophy',
    children: [
      { path: '/contest/create', title: '添加竞赛', icon: 'plus' },
      { path: '/contests', title: '竞赛管理', icon: 'list-ol' }
    ]
  },
  { path: '/statistics', title: '统计', icon: 'line-chart' }
]
