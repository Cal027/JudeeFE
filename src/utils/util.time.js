import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

function duration (startTime, endTime) {
  const start = dayjs(startTime)
  const end = dayjs(endTime)
  return start.to(end, true)
}

function countdown (now, endTime) {
  const endDate = dayjs(endTime)
  const _ms = endDate.diff(now)
  if (_ms > 0) {
    const _dd = endDate.diff(now, 'day')
    const _hh = endDate.diff(now, 'hour')
    const _mm = endDate.diff(now, 'minute')
    const _ss = endDate.diff(now, 'second')

    // 转换
    const hh = _hh - (_dd * 24)
    const mm = _mm - (_hh * 60)
    const ss = _ss - (_mm * 60)

    // 格式化
    const DD = ('00' + _dd).slice(-2)
    const HH = ('00' + hh).slice(-2)
    const MM = ('00' + mm).slice(-2)
    const SS = ('00' + ss).slice(-2)

    return `${DD}天${HH}小时${MM}分钟${SS}秒`
  }
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
  const now = dayjs()
  if (now.isBefore(begin)) {
    return 0
  } else if (now.isAfter(end)) {
    return 1
  } else {
    return 2
  }
}

function isCloseEnd (now, end) {
  const endDate = dayjs(end)
  const diff = endDate.diff(now, 'second')
  return diff <= 3600 && diff > 0
}

export default {
  duration: duration,
  resolveTime: resolveTime,
  resolveTimes: resolveTimes,
  compareTime: compareTime,
  resolveSecond: resolveSecond,
  countdown: countdown,
  isCloseEnd: isCloseEnd
}
