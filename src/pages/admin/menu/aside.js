// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '题目',
    icon: 'list-ul',
    children: [
      { path: '/add-problem', title: '添加题目', icon: 'plus' }
    ]
  }
]
