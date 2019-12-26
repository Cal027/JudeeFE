export default {
  namespaced: true,
  state: {
    contestDetail: {}
  },
  mutations: {
    setContestEndTime (state, endTime) {
      state.contestDetail.end_time = endTime
    }
  }
}
