<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:01:15
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-18 15:56:08
 * @Description: file content
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'app',
  created() {
    ipcRenderer.on('router', (event, message) => {
      if (!this.$route.path.includes(message)) {
        this.$router.push(message)
      }
    })
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
