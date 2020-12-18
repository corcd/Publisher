/*
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:01:15
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-18 15:16:24
 * @Description: file content
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

import Log from '@/views/Log'
import Home from '@/views/Home'
import About from '@/views/About'
import Profile from '@/views/Profile'
import New from '@/views/New'
import Settings from '@/views/Settings'
import Workflow from '@/views/Workflow'

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
    component: Profile,
    meta: {
      title: 'Publisher'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: '前端发布工具'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '前端发布工具'
    }
  },
  {
    path: '/new',
    name: 'New',
    component: New,
    meta: {
      title: '前端发布工具'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      title: '前端发布工具'
    }
  },
  {
    path: '/workflow/:id',
    name: 'Workflow',
    component: Workflow,
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