import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from '@/store'
import Sticky from 'vue-sticky-directive'
import highlight from '@/plugin/highlight'
import VueResize from 'vue-resize'

// 组件
import '@/components'
// svg 图标
import '@/assets/svg-icons'

Vue.use(VueResize)
Vue.use(ElementUI)
Vue.use(Sticky)
Vue.use(highlight)

new Vue({
  router,
  store,
  render: h => h(App),
  mounted () {
    this.$store.dispatch('oj/account/load')
  }
}).$mount('#app')
