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
  return moment(time).format('YYYY-MM-DD HH:mm')
}

export default {
  utcToLocal: utcToLocal,
  duration: duration,
  secondFormat: secondFormat,
  resolveTime: resolveTime
}