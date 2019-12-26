export default {
  namespaced: true,
  state: {
    // 用户信息
    info: {}
  },
  actions: {
    /**
     * @description 设置用户数据
     * @param {Object} context
     * @param {*} info info
     */
    set ({ state, dispatch }, info) {
      return new Promise(async resolve => {
        // store 赋值
        state.info = info
        // 持久化
        await dispatch('oj/db/set', {
          dbName: 'oj',
          path: 'user.info',
          value: info,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * @description 更新用户ac信息
     * @param {Object} context
     * @param {*} acProb
     */
    updateAC ({ state, dispatch }, acProb) {
      return new Promise(async resolve => {
        state.info.ac_prob = acProb
        await dispatch('oj/db/set', {
          dbName: 'oj',
          path: 'user.info',
          value: state.info,
          user: true
        }, { root: true })
      })
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} context
     */
    load ({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.info = await dispatch('oj/db/get', {
          dbName: 'oj',
          path: 'user.info',
          defaultValue: {},
          user: true
        }, { root: true })
        // end
        resolve()
      })
    }
  }
}
