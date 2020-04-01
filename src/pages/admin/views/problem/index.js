const Problem = () => import(/* webpackChunkName: "admin-problem" */ './Problem')
const ProblemList = () => import(/* webpackChunkName: "admin-problem" */'./ProblemList')
const ProblemImport = () => import(/* webpackChunkName: "admin-problem" */'./ProblemImport')

export { Problem, ProblemList, ProblemImport }
