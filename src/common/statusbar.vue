<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-12 21:40:27
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-14 09:38:48
 * @Description: file content
-->
<template>
  <div class="statusbar">
    <el-page-header :content="content" @back="goBackHome"> </el-page-header>
  </div>
</template>

<script>
export default {
  name: 'StatusBar',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  methods: {
    goBackHome() {
      this.$router.push({ name: 'Home' })
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
