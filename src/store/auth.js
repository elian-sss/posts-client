import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    isAuthenticated: localStorage.getItem('authToken') ? true : false, // Verifica se há um token armazenado
    token: localStorage.getItem('authToken')
  },
  mutations: {
    setAuthentication(state, token) {
      state.isAuthenticated = true
      state.token = token
      localStorage.setItem('authToken', token)
    },
    logout(state) {
      state.isAuthenticated = false
      state.token = null
      localStorage.removeItem('authToken')
    }
  }
})

export default store
