function resolveRunTime (time) {
  if (time >= 0 && time !== null) {
    return time + 'MS'
  } else {
    return '-'
  }
}

function resolveMemory (memory) {
  if (!memory) {
    return '-'
  } else if (memory > 1024 * 1024) {
    return (memory / (1024 * 1024)).toFixed(4) + 'MB'
  } else {
    return (memory / 1024).toFixed(4) + 'KB'
  }
}

export default {
  resolveMemory: resolveMemory,
  resolveRunTime: resolveRunTime
}
