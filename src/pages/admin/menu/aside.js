// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
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
  { path: '/submissions', title: '评测', icon: 'codepen' },
  { path: '/statistics', title: '统计', icon: 'line-chart' }
]
