import moment from 'moment'

moment.locale('zh-cn')

// convert utc time to localtime
function utcToLocal (utcDt, format = 'YYYY-M-D  HH:mm:ss') {
  return moment.utc(utcDt).local().format(format)
}

// get duration from startTime to endTime, return like 3 days, 2 hours, one year ..
function duration (startTime, endTime) {
  let start = moment(startTime, 'YYYY-MM-DD HH:mm')
  let end = moment(endTime, 'YYYY-MM-DD HH:mm')
  let duration = moment.duration(start.diff(end, 'seconds'), 'seconds')
  if (duration.days() !== 0) {
    return duration.humanize()
  }
  // return Math.abs(duration.asHours().toFixed(1)) + ' hours'
  return Math.abs(duration.asHours().toFixed(1)) + ' 小时'
}

function secondFormat (seconds) {
  let m = moment.duration(seconds, 'seconds')
  return m.hours() + ':' + m.minutes() + ':' + m.seconds()
}

function resolveTime (time) {
  if (time) {
    return moment(time).format('YYYY-MM-DD HH:mm')
  } else {
    return '-'
  }
}

function resolveTimes (time) {
  if (time) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  } else {
    return '-'
  }
}

function resolveSecond (second) {
  return moment('1900-01-01 00:00:00').add(second, 'seconds').format('HH:mm:ss')
}

function compareTime (begin, end) {
  let now = moment()
  if (now.isBefore(begin)) {
    return 0
  } else if (now.isAfter(end)) {
    return 1
  } else {
    return 2
  }
}

export default {
  utcToLocal: utcToLocal,
  duration: duration,
  secondFormat: secondFormat,
  resolveTime: resolveTime,
  resolveTimes: resolveTimes,
  compareTime: compareTime,
  resolveSecond: resolveSecond
}
