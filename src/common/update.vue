<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-18 15:43:07
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-07-23 14:08:08
 * @Description: file content
-->
<template>
  <transition name="fade">
    <div class="update" :style="`text-align: ${align}`">
      <span v-if="status === -1">更新发生错误</span>
      <span v-else-if="status === 0">正在检查更新</span>
      <span v-else-if="status === 1 && percent < 100">
        更新进度: {{ percent }}%
      </span>
      <span v-else-if="status === 1 && percent >= 100">
        更新完成，请关闭重进
      </span>
      <span v-else-if="status === 2">已是最新版本</span>
      <span v-else @click="updateApp">检查更新</span>
    </div>
  </transition>
</template>

<script>
import { ipcRenderer } from 'electron'
import { mapState } from 'vuex'

export default {
  name: 'Update',
  props: {
    align: {
      type: String,
      default: 'center'
    }
  },
  computed: {
    ...mapState('update', {
      percent: state => state.percent,
      status: state => state.status
    })
  },
  methods: {
    updateApp() {
      console.log('checkForUpdate')
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
