<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-18 14:22:57
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-18 15:57:14
 * @Description: file content
-->
<template>
  <div class="about">
    <Topbar subtitle="关于"></Topbar>
    <StatusBar content=""></StatusBar>
    <section class="about-content">
      <div class="about-content__block">
        <img class="about-content__image" src="@/assets/logo.png" alt="logo" />
        <p class="about-content__title">Publisher</p>
        <span class="about-content__subtitle">云平台前端发布工具</span>
        <span class="about-content__version">v{{ pConfig.version }}</span>
      </div>
      <div class="about-content__footer">
        <span class="about-content__subtitle">Copyright © 2020 Whzcorcd</span>
      </div>
    </section>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import pConfig from '../../../package.json'
import Topbar from '@/common/topbar'
import StatusBar from '@/common/statusbar'

export default {
  name: 'About',
  components: { Topbar, StatusBar },
  data() {
    return {
      pConfig,
      info: []
    }
  },
  mounted() {
    ipcRenderer.send('get-app-info')
    ipcRenderer.on('got-app-info', (event, info) => {
      this.info = info
    })

    console.log(this.info)
  }
}
</script>

<style lang="scss" scoped>
.about {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &-content {
    flex-grow: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 36px 80px 36px;

    &__block {
      width: 200px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }

    &__image {
      width: 150px;
      height: 150px;
      padding: 30px;
    }

    &__title {
      font: {
        size: 20px;
        weight: bold;
      }
    }

    &__subtitle {
      color: #666;
      font: {
        size: 16px;
      }
    }

    &__version {
      margin: 14px 0;
      color: #999;
      font: {
        size: 14px;
      }
    }

    &__footer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        color: #999;
        font: {
          size: 12px;
        }
      }
    }
  }
}
</style>
