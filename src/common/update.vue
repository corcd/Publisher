<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-18 15:43:07
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-19 01:04:57
 * @Description: file content
-->
<template>
  <transition name="fade">
    <div class="update" :style="`text-align: ${align}`">
      <span v-if="visible && percent !== 100">更新进度: {{ percent }}%</span>
      <span v-else-if="visible && percent === 100">
        更新完成，请关闭重进
      </span>
      <span v-else @click="updateApp">检查更新</span>
    </div>
  </transition>
</template>

<script>
import { ipcRenderer } from 'electron'
import { showNotification } from '@/app/notification'

export default {
  name: 'Update',
  props: {
    align: {
      type: String,
      default: 'center'
    }
  },
  data() {
    return {
      visible: false,
      percent: 0
    }
  },
  mounted() {
    // 更新进度
    ipcRenderer.on('downloadProgress', (event, data) => {
      this.percent = data.percent.toFixed(2)
      if (data.percent >= 100) {
        // this.show = false;
      }
    })

    // 更新检测状态
    ipcRenderer.on('message', (event, data) => {
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
          this.visible = true
          break
        case 2:
          showNotification({
            title,
            body: data.msg
          })
          this.visible = false
          break
        default:
          break
      }
    })
  },
  methods: {
    updateApp() {
      ipcRenderer.send('checkForUpdate')
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.update {
  width: 200px;
  height: 60px;
  padding: 0 20px;

  span {
    color: #999;
    font: {
      size: 12px;
    }
    line-height: 60px;
    cursor: pointer;
  }
}
</style>
