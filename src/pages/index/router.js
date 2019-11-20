import Vue from 'vue'
import VueRouter from 'vue-router'

import Intro from '@oj/views/Intro'

const Login = () => import('@oj/views/user/Login')
const Register = () => import('@oj/views/user/Register')
const User = () => import('@oj/views/user/UserHome')
const Tutorial = () => import('@oj/views/tutorial/Tutorial')
const ProfileSetting = () => import('@oj/views/setting/ProfileSetting')
const PasswordSetting = () => import('@oj/views/setting/PasswordSetting')

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
    },
    {
        path: '/tutorial',
        name: 'Tutorial',
        component: Tutorial
    },
    {
        path: '/setting/profile',
        name: 'profile',
        component: ProfileSetting
    },
    {
        path: '/setting/password',
        name: 'password',
        component: PasswordSetting
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
