const ContestList = () => import(/* webpackChunkName: "contest" */ './ContestList')
const ContestDetail = () => import(/* webpackChunkName: "contest" */ './ContestDetail')
const ContestProblemList = () => import(/* webpackChunkName: "contest" */'./children/ContestProblemList')
const ContestRank = () => import(/* webpackChunkName: "contest" */'./children/ContestRank')
const ContestAnnouncement = () => import(/* webpackChunkName: "contest" */'./children/ContestAnnouncement')
const ContestSubmissionDetail = () => import(/* webpackChunkName: "contest" */'./children/ContestSubmissionDetail')

export { ContestList, ContestDetail, ContestProblemList, ContestRank, ContestAnnouncement, ContestSubmissionDetail }
