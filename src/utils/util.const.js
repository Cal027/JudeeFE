const reviewResults = [
  { msg: 'Compile Error', type: 'warning', tag: 'warning' },
  { msg: 'Wrong Answer', type: 'danger', tag: 'error' },
  { msg: 'Accepted', type: 'success', tag: 'success' },
  { msg: 'CPU Time Limit Exceeded', type: 'warning', tag: 'warning' },
  { msg: 'Real Time Limit Exceeded', type: 'warning', tag: 'warning' },
  { msg: 'Memory Limit Exceeded', type: 'warning', tag: 'warning' },
  { msg: 'Runtime Error', type: 'danger', tag: 'error' },
  { msg: 'System Error', type: 'danger', tag: 'error' },
  { msg: 'Pending', type: 'primary', tag: 'primary' },
  { msg: 'Judging', type: 'primary', tag: 'primary' },
  { msg: 'Partially Accepted', type: 'warning', tag: 'warning' }
]

const languageOptions = ['Java', 'C++', 'C', 'Python3']

export {
  reviewResults,
  languageOptions
}
