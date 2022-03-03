import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user')) || null
  },
  mutations: {
    setUser (state, value) {
      state.user = JSON.parse(value)
      window.localStorage.setItem('user', value)
    }
  }
})

export default store
