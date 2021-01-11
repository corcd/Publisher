/* eslint-disable no-shadow */
/*
 * @Author: Whzcorcd
 * @Date: 2021-01-10 20:50:10
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-10 20:52:57
 * @Description: file content
 */
const state = {
  hasNewMail: false
}

const mutations = {
  SET_NEW_MAIL_STATUS_TRUE(state) {
    state.hasNewMail = true
  },
  SET_NEW_MAIL_STATUS_FALSE(state) {
    state.hasNewMail = false
  }
}

const actions = {
  setNewMailStatus({ commit }, { status }) {
    status
      ? commit('SET_NEW_MAIL_STATUS_TRUE')
      : commit('SET_NEW_MAIL_STATUS_FALSE')
  }
}

const getters = {
  hasNewMail: state => {
    return state.hasNewMail
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
