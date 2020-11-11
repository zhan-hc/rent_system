import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  getters: { // 监听数据变化的
    getStorage (state) { // 获取本地存储的登录信息
      if (!state.token) {
        state.token = JSON.parse(localStorage.getItem('token'))
      }
      return state.token
    }
  }
})
