<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-08 13:23:42
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-19 00:58:48
 * @Description: file content
-->
<template>
  <div class="log">
    <Topbar subtitle="成员校验" :extra="`v${pConfig.version}`" update></Topbar>
    <div class="log-content">
      <section class="log-loginbox">
        <header>
          <span>团队成员校验</span>
        </header>
        <content>
          <el-input
            type="text"
            size="mini"
            placeholder="成员名"
            v-model="authInfo.username"
          ></el-input>
          <el-input
            type="password"
            size="mini"
            placeholder="校验码"
            show-password
            v-model="authInfo.password"
          ></el-input>
        </content>
        <footer>
          <el-button
            type="primary"
            size="mini"
            :loading="btnLoading"
            @click="submit"
          >
            校 验
          </el-button>
        </footer>
      </section>
    </div>
  </div>
</template>

<script>
import pConfig from '../../../package.json'

import { getUser } from '#/plugins/lowdb'
import { login } from '@/modules/auth'
import Topbar from '@/common/topbar'

export default {
  name: 'Log',
  components: { Topbar },
  data() {
    return {
      pConfig,
      btnLoading: false,
      authInfo: {
        username: '',
        password: ''
      }
    }
  },
  mounted() {
    window.addEventListener(
      'keyup',
      e => {
        if (e.key === 'Enter') this.submit()
      },
      true
    )
  },
  beforeDestroy() {
    window.removeEventListener('keyup', e => {
      if (e.key === 'Enter') this.submit()
    })
  },
  methods: {
    submit() {
      this.btnLoading = true

      const res = login(this.authInfo)
      if (res) {
        console.log(getUser)
        const isFull = Object.values(getUser).some(item => item.trim() === '')
        return isFull
          ? this.$router.push({ name: 'Profile' })
          : this.$router.push({ name: 'Home' })
      }
      console.error('验证未通过')
      this.btnLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.log {
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
    padding: 36px;
  }

  &-loginbox {
    max-width: 480px;
    padding: 36px;
    border: 1px solid #dedede;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px 0px;

    header {
      width: 100%;
      margin-bottom: 20px;
      color: #333;
      text-align: left;
      font: {
        size: 18px;
        weight: 500;
      }
    }

    content {
      width: 100%;

      .el-input {
        padding: 5px 0;
      }
    }

    footer {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>
