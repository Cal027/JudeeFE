const ContestList = () => import(/* webpackChunkName: "oj-contest" */ './ContestList')
const ContestDetail = () => import(/* webpackChunkName: "oj-contest" */ './ContestDetail')
const ContestProblemList = () => import(/* webpackChunkName: "oj-contest" */'./children/ContestProblemList')
const ContestRank = () => import(/* webpackChunkName: "oj-contest" */'./children/ContestRank')
const ContestAnnouncement = () => import(/* webpackChunkName: "oj-contest" */'./children/ContestAnnouncement')
const ContestSubmissionDetail = () => import(/* webpackChunkName: "oj-contest" */'./children/ContestSubmissionDetail')

export { ContestList, ContestDetail, ContestProblemList, ContestRank, ContestAnnouncement, ContestSubmissionDetail }
