<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:01:15
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-11 18:05:45
 * @Description: file content
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  min-width: 750px;
  background: #fff;
  user-select: none;
}
</style>
