import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

function duration (startTime, endTime) {
  let start = dayjs(startTime)
  let end = dayjs(endTime)
  return start.to(end, true)
}

function resolveTime (time) {
  if (time) {
    return dayjs(time).format('YYYY-MM-DD HH:mm')
  } else {
    return '-'
  }
}

function resolveTimes (time) {
  if (time) {
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
  } else {
    return '-'
  }
}

function resolveSecond (seconds) {
  const hour = Math.floor(seconds / 3600)
  const minute = Math.floor(seconds / 60 % 60)
  const second = seconds % 60
  return `${hour < 100 ? (Array(2).join(0) + hour).slice(-2) : hour}:${(Array(2).join(0) + minute).slice(-2)}:${(Array(2).join(0) + second).slice(-2)}`
}

function compareTime (begin, end) {
  let now = dayjs()
  if (now.isBefore(begin)) {
    return 0
  } else if (now.isAfter(end)) {
    return 1
  } else {
    return 2
  }
}

export default {
  duration: duration,
  resolveTime: resolveTime,
  resolveTimes: resolveTimes,
  compareTime: compareTime,
  resolveSecond: resolveSecond
}
