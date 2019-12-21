export function getBrowserInfo () {
  var agent = navigator.userAgent.toLowerCase()
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
