import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName: sessionStorage.getItem("username"),
    userId: sessionStorage.getItem("userId")
  },
  mutations: {
    setUserName(state, payload) {
      state.userName = payload
    },
    setUserId(state, payload) {
      state.userId = payload
    }
  }
})
