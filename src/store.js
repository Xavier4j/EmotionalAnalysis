import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 全局变量
  state: {
    barColor: 'rgba(0, 0, 0, .6), rgba(0, 0, 0, .6)',
    barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
    search: "",
    //登录状态管理
    user: window.sessionStorage.getItem('user'),
    role: window.sessionStorage.getItem('role'),
    plateIds: window.sessionStorage.getItem('plateIds'),
    token: window.sessionStorage.getItem('token'),
    avatar: window.sessionStorage.getItem('avatar'),

  },
  // 修改全局变量必须通过mutations中的方法
  // mutations只能采用同步方法
  mutations: {
    SET_BAR_IMAGE(state, payload) {
      state.barImage = payload
    },
    SET_DRAWER(state, payload) {
      state.drawer = payload
    },
    LOGIN(state, payload) {
      state.token = payload.id
      state.user = payload.username
      state.role = payload.role
      state.plateIds = payload.plateIds
      state.avatar = payload.userProfile.avatar
      window.sessionStorage.setItem('token', payload.id)
      window.sessionStorage.setItem('user', payload)
      window.sessionStorage.setItem('role', payload.role)
      window.sessionStorage.setItem('plateIds', payload.plateIds)
      window.sessionStorage.setItem('avatar', payload.userProfile.avatar)
    },
    SET_USER(state, payload) {
      state.user = payload
      window.sessionStorage.setItem('user', payload)
    },
    SET_AVATAR(state, payload) {
      state.avatar = payload
      window.sessionStorage.setItem('avatar', payload)
    },
    LOGOUT(state) {
      state.token = undefined
      state.user = undefined
      state.role = undefined
      state.plateIds = undefined
      state.avatar = undefined
      sessionStorage.clear()
    },
    SET_SEARCH(state, payload) {
      state.search = payload
    },
  },
  // 异步方法用actions
  // actions不能直接修改全局变量，需要调用commit方法来触发mutation中的方法
  actions: {
    LOGIN(context, payload) {
      context.commit('LOGIN', payload)
    },
    LOGOUT(context) {
      context.commit('LOGOUT')
    }
  }
})
