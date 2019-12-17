export default {
  namespaced: true,
  actions: {
    load ({ dispatch }) {
      return new Promise(async resolve => {
        // DB -> store 持久化数据加载颜色设置
        await dispatch('oj/color/load', null, { root: true })
        resolve()
      })
    }
  }
}
