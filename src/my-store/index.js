import Vue from 'vue'
import Vuex from './MyVuex'

// 实现this.$store
// 实现state的所有数据响应式
// 实现commit、dispatch
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    add(state){
      state.count++
    }
  },
  actions: {
    add({commit}){
      setTimeout(() => {
        commit('add')
      }, 1000)
    }
  },
  modules: {
  }
})
