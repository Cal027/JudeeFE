const Contest = () => import(/* webpackChunkName: "admin-contest" */ './Contest')
const ContestList = () => import(/* webpackChunkName: "admin-contest" */ './ContestList')
const ContestProblemList = () => import(/* webpackChunkName: "admin-contest" */'./ContestProblemList')
const ContestAnnouncement = () => import(/* webpackChunkName: "admin-contest" */'./ContestAnnouncement')

export { Contest, ContestList, ContestProblemList, ContestAnnouncement }
