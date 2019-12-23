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

function toLetter (index) {
  return String.fromCharCode(64 + parseInt(index))
}

function getRankColor (rank) {
  let color = ''
  switch (rank) {
    case 1:
      color = '#BF616A'
      break
    case 2:
      color = '#D08770'
      break
    case 3:
      color = '#EBCB8B'
      break
    default:
      color = '#B48EAD'
  }
  return { color: color, 'font-weight': 600 }
}

function getLanguage (lang) {
  switch (lang) {
    case 'C++':
      return 'cpp'
    case 'Python3':
      return 'python'
    default:
      return 'java'
  }
}

function getCodeColor (type) {
  switch (type) {
    case 'primary':
      return 'gray'
    case 'success':
      return 'green'
    case 'warning':
      return 'orange'
    default:
      return 'red'
  }
}

export default {
  resolveMemory: resolveMemory,
  resolveRunTime: resolveRunTime,
  toLetter: toLetter,
  getRankColor: getRankColor,
  getLanguage: getLanguage,
  getCodeColor: getCodeColor
}
