import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'
import time from './util.time'
import formatter from './util.formatter'

const util = {
  cookies,
  db,
  log,
  time,
  formatter
}

/**
 * @description 更新标题
 * @param titleText
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'Judee OJ'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

export default util
