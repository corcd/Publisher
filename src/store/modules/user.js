/* eslint-disable no-shadow */
/*
 * @Author: Whzcorcd
 * @Date: 2021-01-05 12:14:41
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-05 16:54:06
 * @Description: file content
 */
import Vue from 'vue'

const state = {
  developers: [],
  productManagers: [],
  session: {
    type: ''
  }
}

const mutations = {
  SET_USER_DEVELOPER_LIST(state, list) {
    state.developers = [...list]
  },
  SET_USER_PM_LIST(state, list) {
    state.productManagers = [...list]
  },
  SET_USER_DEVELOPER_TYPE(state) {
    Vue.set(state.session, 'type', 'developer')
  },
  SET_USER_PM_TYPE(state) {
    Vue.set(state.session, 'type', 'product-manager')
  },
  CLEAR_USER_SESSION(state) {
    Vue.set(state.session, 'type', '')
  }
}

const actions = {
  setUserList({ commit }, { developersList, productManagersList }) {
    commit('SET_USER_DEVELOPER_LIST', developersList)
    commit('SET_USER_PM_LIST', productManagersList)
  },
  setUserSession({ state, commit }, { username }) {
    if (state.developers.includes(username)) {
      commit('SET_USER_DEVELOPER_TYPE')
      return Promise.resolve()
    } else if (state.productManagers.includes(username)) {
      commit('SET_USER_PM_TYPE')
      return Promise.resolve()
    } else {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject()
    }
  },
  clearUserSession({ commit }) {
    commit('CLEAR_USER_SESSION')
  }
}

const getters = {
  isDeveloper: state => {
    return state.session.type === 'developer'
  },
  isPM: state => {
    return state.session.type === 'product-manager'
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
