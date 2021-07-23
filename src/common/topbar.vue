<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-10 21:04:23
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-07-23 14:43:43
 * @Description: file content
-->
<template>
  <div class="topbar">
    <section>
      <span class="topbar-title">Publisher</span>
      <div class="topbar-subtitle">
        <span>{{ subtitle }}</span>
      </div>
      <Update align="right" v-show="update"></Update>
      <span class="topbar-copyright"> {{ extra }} 云平台前端团队 </span>
    </section>
  </div>
</template>

<script>
import Update from './update'

export default {
  name: 'Topbar',
  components: {
    Update
  },
  props: {
    subtitle: {
      type: String,
      default: '前端发布系统'
    },
    extra: {
      type: String,
      default: ''
    },
    update: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 0 20px;
  background-color: #fff;
  z-index: 10;
  -webkit-app-region: drag;

  section {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;

    .topbar-title {
      color: #0064c8;
      font: {
        size: 22px;
        weight: bold;
      }
    }

    .topbar-subtitle {
      flex-grow: 1;
      padding: 0 10px;
      color: #333;
      text-align: left;
      font: {
        size: 14px;
      }
    }

    .topbar-copyright {
      color: #999;
      font: {
        size: 12px;
      }
    }
  }
}
</style>
