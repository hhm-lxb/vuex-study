import Vuex from '../vuex/index'
import Vue from 'vue'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    b: {
      namespaced: true,
      state: {
        b: 2
      },
      getters: {
        bb (state) {
          return state.b
        }
      },
      mutations: {
        changeB (state, payload) {
          state.b += payload
        }
      },
      actions: {
        actionB ({ commit }, payload) {
          setTimeout(() => {
            commit('changeB', payload)
          }, 1000)
        }
      }
    },
    c: {
      namespaced: true,
      state: {
        c: 3
      },
      getters: {
        cc (state) {
          return state.c
        }
      },
      mutations: {
        changeC (state, payload) {
          state.c += payload
        }
      },
      actions: {
        actionC ({ commit }, payload) {
          setTimeout(() => {
            commit('changeC', payload)
          }, 1000)
        }
      }
    }
  },
  state: {
    a: 1
  },
  getters: {
    aa (state) {
      return state.a
    }
  },
  mutations: {
    changeA (state, payload) {
      state.a = payload + 1
    }
  },
  actions: {
    actionA ({ commit }, payload) {
      setTimeout(() => {
        commit('changeA', payload)
      }, 2000)
    }
  }
})