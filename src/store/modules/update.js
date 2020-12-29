/* eslint-disable no-shadow */
/*
 * @Author: Whzcorcd
 * @Date: 2020-12-28 14:57:35
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-28 15:16:25
 * @Description: file content
 */
const state = {
  status: -2,
  msg: '',
  percent: 0
}

const mutations = {
  SET_UPDATE_STATUS(state, { status, msg }) {
    state.status = status
    state.msg = msg
  },
  SET_UPDATE_PROCESS(state, { percent }) {
    state.percent = percent.toFixed(2)
  }
}

const actions = {
  setUpdateStatus({ commit }, preload) {
    console.log(preload)
    commit('SET_UPDATE_STATUS', preload)
  },
  setUpdateProcess({ commit }, preload) {
    commit('SET_UPDATE_PROCESS', preload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
