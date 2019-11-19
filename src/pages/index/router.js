import Vue from 'vue'
import VueRouter from 'vue-router'

import Intro from '@oj/views/Intro'

const Login = () => import('@oj/views/user/Login')
const Register = () => import('@oj/views/user/Register')
const User = () => import('@oj/views/user/UserHome')
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'intro',
        component: Intro
    },
    {
        path: '/home',
        name: 'intro',
        component: Intro
    },
    {
        path: '/user',
        name: 'user',
        component: User
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
