import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import md5 from 'js-md5'
import api from './api'

Vue.use(ElementUI)
Vue.prototype.$md5 = md5
Vue.prototype.$api = api

new Vue({
    router,
    el: '#app',
    render: h => h(App)
})
