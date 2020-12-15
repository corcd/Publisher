/*
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:01:15
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-14 14:06:09
 * @Description: file content
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

import Log from '@/views/Log.vue'
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'
import New from '@/views/New.vue'
import Settings from '@/views/Settings.vue'
import Workflow from '@/views/Workflow.vue'

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
