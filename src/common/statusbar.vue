<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-12 21:40:27
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-07 16:36:58
 * @Description: file content
-->
<template>
  <div class="statusbar">
    <el-page-header :content="content" @back="goBackHome"> </el-page-header>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'StatusBar',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters('user', ['isDeveloper', 'isPM'])
  },
  methods: {
    goBackHome() {
      this.isDeveloper && this.$router.push({ name: 'Home' })
      this.isPM && this.$router.push({ name: 'Check' })
    }
  }
}
</script>

<style lang="scss" scoped>
.statusbar {
  width: 100%;
  padding: 10px 20px;
}
</style>
