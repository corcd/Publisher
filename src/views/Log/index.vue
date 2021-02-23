<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-08 13:23:42
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-02-03 18:12:09
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
        <header>
          <span class="subtitle">
            {{ subtitle }}
          </span>
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
import { mapGetters } from 'vuex'
import { getUser } from '#/plugins/data'
import { login } from '@/modules/auth'
import Topbar from '@/common/topbar'

import pConfig from '../../../package.json'

export default {
  name: 'Log',
  components: { Topbar },
  data() {
    return {
      pConfig,
      subtitle: '重要：该应用涉及相关隐私安全，仅限内部使用，切勿泄露',
      btnLoading: false,
      authInfo: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters('user', ['isDeveloper', 'isPM'])
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
    async submit() {
      this.btnLoading = true

      try {
        await login(this.authInfo)

        const isFull = Object.values(getUser()).every(
          item => item.trim() !== ''
        )
        if (!isFull) {
          return this.$router.push({ name: 'Profile' })
        }
        this.isDeveloper && this.$router.push({ name: 'Home' })
        this.isPM && this.$router.push({ name: 'Check' })
      } catch (err) {
        console.error('验证未通过', err)
        this.btnLoading = false
      }
      return
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
      margin-right: 10px;
      margin-bottom: 10px;
      color: #333;
      text-align: left;
      font: {
        size: 18px;
        weight: 500;
      }

      .subtitle {
        color: #ff5959;
        font: {
          size: 12px;
          weight: 500;
        }
        cursor: pointer;
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
