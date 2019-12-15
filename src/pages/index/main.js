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

function getBrowserInfo () {
  var agent = navigator.userAgent.toLowerCase()
  console.log(agent)
  var arr = []
  var system = agent.split(' ')[1].split(' ')[0].split('(')[1]
  arr.push(system)
  const regStrEdge = /edge\/[\d.]+/gi
  const regStrIE = /trident\/[\d.]+/gi
  const regStrFF = /firefox\/[\d.]+/gi
  const regStrChrome = /chrome\/[\d.]+/gi
  const regStrSaf = /safari\/[\d.]+/gi
  const regStrOpera = /opr\/[\d.]+/gi
  // IE
  if (agent.indexOf('trident') > 0) {
    arr.push(agent.match(regStrIE)[0].split('/')[0])
    arr.push(agent.match(regStrIE)[0].split('/')[1])
    return arr
  }
  // Edge
  if (agent.indexOf('edge') > 0) {
    arr.push(agent.match(regStrEdge)[0].split('/')[0])
    arr.push(agent.match(regStrEdge)[0].split('/')[1])
    return arr
  }
  // firefox
  if (agent.indexOf('firefox') > 0) {
    arr.push(agent.match(regStrFF)[0].split('/')[0])
    arr.push(agent.match(regStrFF)[0].split('/')[1])
    return arr
  }
  // Opera
  if (agent.indexOf('opr') > 0) {
    arr.push(agent.match(regStrOpera)[0].split('/')[0])
    arr.push(agent.match(regStrOpera)[0].split('/')[1])
    return arr
  }
  // Safari
  if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
    arr.push(agent.match(regStrSaf)[0].split('/')[0])
    arr.push(agent.match(regStrSaf)[0].split('/')[1])
    return arr
  }
  // Chrome
  if (agent.indexOf('chrome') > 0) {
    arr.push(agent.match(regStrChrome)[0].split('/')[0])
    arr.push(agent.match(regStrChrome)[0].split('/')[1])
    return arr
  } else {
    arr.push('请更换主流浏览器，例如chrome,firefox,opera,safari')

    return arr
  }
}

try {
  // getYourIP();
  store.state.loginInfo = getBrowserInfo().toString()
} catch (error) {
  console.log(error)
}

new Vue({
  router,
  el: '#app',
  store,
  render: h => h(App),
  mounted () {
    this.$store.dispatch('oj/color/load', null, { root: true })
  }
}).$mount('#app')
