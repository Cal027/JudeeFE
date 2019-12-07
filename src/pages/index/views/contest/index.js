const ContestList = () => import(/* webpackChunkName: "contest" */ './ContestList')
const ContestDetail = () => import(/* webpackChunkName: "contest" */ './ContestDetail')
const ContestProblemList = () => import(/* webpackChunkName: "contest" */'./children/ContestProblemList')
const ContestRank = () => import(/* webpackChunkName: "contest" */'./children/ContestRank')

export { ContestList, ContestDetail, ContestProblemList, ContestRank }
