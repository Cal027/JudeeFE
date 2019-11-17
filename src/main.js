// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import api from './api'
import Vuex from 'vuex'
import md5 from 'js-md5';
import axios from 'axios';
import VueClipboard from 'vue-clipboard2'
import 'babel-polyfill' //兼容IE6
import MuseUI from 'muse-ui';

Vue.use(MuseUI);

Vue.use(VueClipboard);
Vue.use(Vuex);
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$md5 = md5;
Vue.prototype.$api = api; // 将api挂载到vue的原型上


//开启debug模式
Vue.config.debug = true;
axios.defaults.withCredentials = true;//实现跨域访问
axios.defaults.baseURL = process.env.API_ROOT;//设置根路径
// Vue.prototype.$axios = axios;

const store = new Vuex.Store({
  state: {},
});


if (sessionStorage.username !== "" && sessionStorage.username !== undefined) {
  //获取一下用户的AC题目，全局保存。
  axios
    .get("/userdata/?username=" + sessionStorage.username)
    .then(response => {
      sessionStorage.setItem("rating", response.data[0].rating);
      var acpro = response.data[0].acpro.split("|");
      acpro.shift(); //因为最前面会多出一个空，去掉它
      store.state.acpro = acpro;
      sessionStorage.setItem("ac_prob", acpro);
    });
} else {
  sessionStorage.setItem("username", "");
  sessionStorage.setItem("name", "");
  sessionStorage.setItem("rating", "");
  sessionStorage.setItem("type", "");
  sessionStorage.setItem("ac_prob", "");
}



function getBrowserInfo() {
  var agent = navigator.userAgent.toLowerCase();
  console.log(agent);
  var arr = [];
  var system = agent.split(' ')[1].split(' ')[0].split('(')[1];
  arr.push(system);
  const regStr_edge = /edge\/[\d.]+/gi;
  const regStr_ie = /trident\/[\d.]+/gi;
  const regStr_ff = /firefox\/[\d.]+/gi;
  const regStr_chrome = /chrome\/[\d.]+/gi;
  const regStr_saf = /safari\/[\d.]+/gi;
  const regStr_opera = /opr\/[\d.]+/gi;
  //IE
  if (agent.indexOf("trident") > 0) {
    arr.push(agent.match(regStr_ie)[0].split('/')[0]);
    arr.push(agent.match(regStr_ie)[0].split('/')[1]);
    return arr;
  }
  //Edge
  if (agent.indexOf('edge') > 0) {
    arr.push(agent.match(regStr_edge)[0].split('/')[0]);
    arr.push(agent.match(regStr_edge)[0].split('/')[1]);
    return arr;
  }
  //firefox
  if (agent.indexOf("firefox") > 0) {
    arr.push(agent.match(regStr_ff)[0].split('/')[0]);
    arr.push(agent.match(regStr_ff)[0].split('/')[1]);
    return arr;
  }
  //Opera
  if (agent.indexOf("opr") > 0) {
    arr.push(agent.match(regStr_opera)[0].split('/')[0]);
    arr.push(agent.match(regStr_opera)[0].split('/')[1]);
    return arr;
  }
  //Safari
  if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
    arr.push(agent.match(regStr_saf)[0].split('/')[0]);
    arr.push(agent.match(regStr_saf)[0].split('/')[1]);
    return arr;
  }
  //Chrome
  if (agent.indexOf("chrome") > 0) {
    arr.push(agent.match(regStr_chrome)[0].split('/')[0]);
    arr.push(agent.match(regStr_chrome)[0].split('/')[1]);
    return arr;
  } else {
    arr.push('请更换主流浏览器，例如chrome,firefox,opera,safari');


    return arr;
  }
}

try {
  // getYourIP();
  store.state.logininfo = getBrowserInfo().toString()
} catch (error) {
  console.log(error)
}


new Vue({
  el: '#app',
  router,
  components: {App},
  store,
  template: '<App/>',
  render: h => h(App),
  created() {
    if (this.$store.state.loginip.indexOf("请使用主流浏览器") >= 0) {
      this.$message.success("推荐使用主流浏览器，例如Chrome,Firefox,Opera,Safari等，如果是360浏览器，请关闭极速模式！")
    }
  }
});

