import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import api from './api'
import store from '@/store'
import axios from 'axios'
import Sticky from 'vue-sticky-directive'
import hljs from 'highlight.js'
import highlight from '@/plugin/highlight'
import 'highlight.js/styles/atom-one-light.css'

// 组件
import '@/components'
// svg 图标
import '@/assets/svg-icons'

Vue.use(ElementUI)
Vue.use(Sticky)
Vue.use(highlight)
Vue.prototype.$api = api
Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre.ql-syntax')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

axios.defaults.withCredentials = true// 实现跨域访问
axios.defaults.baseURL = process.env.API_ROOT// 设置根路径

new Vue({
  router,
  store,
  render: h => h(App),
  mounted () {
    this.$store.dispatch('oj/account/load')
  }
}).$mount('#app')
