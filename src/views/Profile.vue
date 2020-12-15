<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-10 17:44:39
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-14 09:39:57
 * @Description: file content
-->
<template>
  <div class="profile">
    <Topbar subtitle="录入资料"></Topbar>
    <div class="profile-content">
      <section class="profile-profilebox">
        <header>
          <span>录入个人名片资料</span>
        </header>
        <content>
          <el-input
            type="text"
            size="mini"
            placeholder="姓名"
            v-model="profileInfo.name"
          ></el-input>
          <el-input
            type="number"
            size="mini"
            placeholder="联系方式"
            v-model="profileInfo.contact"
          ></el-input>
          <el-input
            type="email"
            size="mini"
            placeholder="工作邮箱"
            v-model="profileInfo.workmail"
          ></el-input>
        </content>
        <footer>
          <el-button
            type="primary"
            size="mini"
            :loading="btnLoading"
            @click="submit"
          >
            提 交
          </el-button>
        </footer>
      </section>
    </div>
  </div>
</template>

<script>
import { getUser, setUser } from '#/plugins/lowdb'
import Topbar from '@/common/topbar'

export default {
  name: 'Profile',
  components: { Topbar },
  data() {
    return {
      btnLoading: false,
      profileInfo: {
        name: '',
        contact: '',
        workmail: ''
      }
    }
  },
  mounted() {
    Object.assign(this.profileInfo, getUser)
  },
  methods: {
    submit() {
      this.btnLoading = true
      setUser(this.profileInfo)
      this.btnLoading = false
      return this.$router.push({ name: 'Home' })
    }
  }
}
</script>

<style lang="scss" scoped>
.profile {
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

  &-profilebox {
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
