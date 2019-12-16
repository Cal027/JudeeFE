const ContestList = () => import(/* webpackChunkName: "contest" */ './ContestList')
const ContestDetail = () => import(/* webpackChunkName: "contest" */ './ContestDetail')
const ContestProblemList = () => import(/* webpackChunkName: "contest" */'./children/ContestProblemList')
const ContestRank = () => import(/* webpackChunkName: "contest" */'./children/ContestRank')
const ContestAnnouncement = () => import(/* webpackChunkName: "contest" */'./children/ContestAnnouncement')

export { ContestList, ContestDetail, ContestProblemList, ContestRank, ContestAnnouncement }
