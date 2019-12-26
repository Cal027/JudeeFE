export default {
  namespaced: true,
  state: {
    contestDetail: {}
  },
  mutations: {
    setContest (state, contest) {
      state.contestDetail = contest
    }
  }
}
