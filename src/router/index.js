/*
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:01:15
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-06 17:43:50
 * @Description: file content
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

import Log from '@/views/Log'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Log',
    component: Log,
    meta: {
      title: 'Publisher'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () =>
      import(/* webpackChunkName: "chunk-profile" */ '@/views/Profile'),
    meta: {
      title: 'Publisher'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () =>
      import(/* webpackChunkName: "chunk-about" */ '@/views/About'),
    meta: {
      title: '前端发布工具'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () =>
      import(/* webpackChunkName: "chunk-home" */ '@/views/Home'),
    meta: {
      title: '前端发布工具',
      keepAlive: true,
      isInitial: false
    }
  },
  {
    path: '/check',
    name: 'Check',
    component: () =>
      import(/* webpackChunkName: "chunk-check" */ '@/views/Check'),
    meta: {
      title: '前端发布工具',
      keepAlive: true,
      isInitial: false
    }
  },
  {
    path: '/new',
    name: 'New',
    component: () => import(/* webpackChunkName: "chunk-new" */ '@/views/New'),
    meta: {
      title: '前端发布工具'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () =>
      import(/* webpackChunkName: "chunk-settings" */ '@/views/Settings'),
    meta: {
      title: '前端发布工具'
    }
  },
  {
    path: '/workflow/:id',
    name: 'Workflow',
    component: () =>
      import(/* webpackChunkName: "chunk-workflow" */ '@/views/Workflow'),
    meta: {
      title: '前端发布工具'
    }
  }
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
