const Login = () => import(/* webpackChunkName: "admin-system" */ './login')
const Error404 = () => import(/* webpackChunkName: "admin-system" */ './error/404')
const Log = () => import(/* webpackChunkName: "admin-system" */ './log')
const Refresh = () => import(/* webpackChunkName: "admin-system" */ './function/refresh')
const Redirect = () => import(/* webpackChunkName: "admin-system" */ './function/redirect')

export { Login, Error404, Log, Redirect, Refresh }
