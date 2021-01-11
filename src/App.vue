<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:01:15
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-09 16:13:57
 * @Description: file content
-->
<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapActions } from 'vuex'
import { showNotification } from '@/app/notification'

export default {
  name: 'app',
  created() {
    // 路由变更
    ipcRenderer.on('router', (event, message) => {
      if (!this.$route.path.includes(message)) {
        this.$router.push(message)
      }
    })

    // 更新进度
    ipcRenderer.on('downloadProgress', (event, data) => {
      const percent = data.percent.toFixed(2)
      this.setUpdateProcess({ percent })
    })

    // 更新检测状态
    ipcRenderer.on('message', (event, data) => {
      this.setUpdateStatus({ status: data.status, msg: data.msg })
      const title = '自动更新'
      switch (data.status) {
        case -1:
          showNotification({
            title,
            body: data.msg
          })
          break
        case 0:
          showNotification({
            title,
            body: data.msg
          })
          break
        case 1:
          showNotification({
            title,
            body: data.msg
          })
          break
        case 2:
          showNotification({
            title,
            body: data.msg
          })
          break
        default:
          break
      }
    })
  },
  methods: {
    ...mapActions('update', ['setUpdateStatus', 'setUpdateProcess'])
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  min-width: 750px;
  background: #fff;
  user-select: none;
}
</style>
