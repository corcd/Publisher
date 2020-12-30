/* eslint-disable no-shadow */
/*
 * @Author: Whzcorcd
 * @Date: 2020-12-28 14:52:41
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-30 15:26:41
 * @Description: file content
 */
import dayjs from 'dayjs'

const state = {
  ongoingTasks: [],
  failedTasks: [],
  completedTasks: [],
  taskHistory: []
}

const mutations = {
  ADD_ONGOING_TASKS(state, { id }) {
    if (!state.ongoingTasks.includes(id)) {
      if (state.failedTasks.includes(id)) {
        state.failedTasks.splice(state.failedTasks.indexOf(id), 1)
      }
      if (state.completedTasks.includes(id)) {
        state.completedTasks.splice(state.completedTasks.indexOf(id), 1)
      }
      state.ongoingTasks.push(id)
    }
  },
  ADD_FAILED_TASKS(state, { id, err }) {
    if (state.ongoingTasks.includes(id) && !state.failedTasks.includes(id)) {
      state.ongoingTasks.splice(state.ongoingTasks.indexOf(id), 1)
      state.failedTasks.push(id)
    }
    state.taskHistory.push({
      id,
      status: 'failed',
      result: err instanceof Error ? err.message : err,
      timestamp: dayjs().unix()
    })
  },
  ADD_COMPLETED_TASKS(state, { id }) {
    if (state.ongoingTasks.includes(id) && !state.completedTasks.includes(id)) {
      state.ongoingTasks.splice(state.ongoingTasks.indexOf(id), 1)
      state.completedTasks.push(id)
    }
    state.taskHistory.push({
      id,
      status: 'completed',
      result: 'success',
      timestamp: dayjs().unix()
    })
  }
}

const actions = {
  addOngoingTasks({ commit }, preload) {
    commit('ADD_ONGOING_TASKS', preload)
  },
  addFailedTasks({ commit }, preload) {
    commit('ADD_FAILED_TASKS', preload)
  },
  addCompletedTasks({ commit }, preload) {
    commit('ADD_COMPLETED_TASKS', preload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
