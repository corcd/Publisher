<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-12 21:37:09
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-16 16:32:42
 * @Description: file content
-->
<template>
  <div class="setting">
    <Topbar subtitle="系统设置"></Topbar>
    <StatusBar content=""></StatusBar>
    <div class="setting-content">
      <el-form
        class="setting-form"
        label-position="top"
        label-width="80px"
        size="mini"
        :model="settingsData"
      >
        <el-form-item><p class="setting-form__topic">个人资料</p></el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="settingsData.user.name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="settingsData.user.contact"></el-input>
        </el-form-item>
        <el-form-item label="工作邮箱">
          <el-input v-model="settingsData.user.workmail"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item>
          <p class="setting-form__topic">发件人设置</p>
        </el-form-item>
        <el-form-item label="发件邮箱">
          <el-input
            type="text"
            v-model="settingsData.mail.auth.user"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证密钥">
          <el-input
            type="password"
            show-password
            v-model="settingsData.mail.auth.pass"
          ></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item>
          <p class="setting-form__topic">收件人设置</p>
        </el-form-item>
        <el-form-item label="收件邮箱">
          <el-input v-model="settingsData.mail.addressee"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" size="mini" @click="submit">
            保 存
          </el-button>
          <el-button type="default" size="mini" @click="reset">
            重 置
          </el-button>
          <el-button type="danger" size="mini" @click="quit">
            退 出
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import {
  getUser,
  getMail,
  setUser,
  setMailAuth,
  setMailAddressee
} from '#/plugins/lowdb'
import { logout } from '@/modules/auth'
import Topbar from '@/common/topbar'
import StatusBar from '@/common/statusbar'

export default {
  name: 'Settings',
  components: { Topbar, StatusBar },
  data() {
    return {
      settingsData: { user: null, mail: null },
      autosaveTimer: null,
      timeInterval: 10000
    }
  },
  created() {
    this.freshData()
  },
  mounted() {
    this.autosave()
  },
  beforeDestroy() {
    this.autosaveTimer && clearTimeout(this.autosaveTimer)
    this.autosaveTimer = null
  },
  methods: {
    freshData() {
      this.settingsData = { user: null, mail: null }

      this.$set(this.settingsData, 'user', JSON.parse(JSON.stringify(getUser)))
      this.$set(this.settingsData, 'mail', JSON.parse(JSON.stringify(getMail)))
      console.log(this.settingsData)
    },
    submit() {
      Message.closeAll()
      this.save()
      this.freshData()

      // TODO 修改为全局通知
      Message.success('数据已保存')
    },
    autosave() {
      this.autosaveTimer && clearTimeout(this.autosaveTimer)
      this.submit()
      this.autosaveTimer = setTimeout(() => this.autosave(), this.timeInterval)
    },
    save() {
      setUser(this.settingsData.user)
      setMailAuth(this.settingsData.mail.auth)
      setMailAddressee({ addressee: this.settingsData.mail.addressee })
    },
    reset() {
      this.freshData()
    },
    quit() {
      logout()
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
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
    justify-content: flex-start;
    padding: 16px 36px 36px 36px;
  }

  &-form {
    width: 70%;

    &::v-deep .setting-form__topic {
      width: 100%;
      text-align: left;
      font: {
        size: 14px;
        weight: 500;
      }
    }

    &::v-deep .el-divider--horizontal {
      margin: 12px 0;
    }

    &::v-deep .el-form-item {
      margin-bottom: 0px;
      padding-bottom: 10px;
      text-align: left;
    }

    &::v-deep .el-form-item__label {
      width: 100%;
      height: 24px;
      padding: 0;
      font: {
        size: 12px;
        weight: 500;
      }
      line-height: 24px;
    }
  }
}
</style>
