/*
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:01:15
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-11 21:58:51
 * @Description: file content
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api'
import './permission'
import './plugins/element'

import '*/menu'

import '@/assets/styles/index.scss'

Object.defineProperties(Vue.prototype, {
  $api: {
    get() {
      return api
    }
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
