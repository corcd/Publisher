<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-09 01:17:27
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-10 18:27:53
 * @Description: file content
-->
<template>
  <div class="searchbar">
    <span>数据集</span>
    <el-input
      type="text"
      size="mini"
      placeholder="搜索"
      v-model="searchWord"
    ></el-input>
    <div>
      <el-button type="primary" size="mini" round>搜索</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Searchbar',
  data() {
    return {
      searchWord: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.searchbar {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 36px;

  span {
    flex-shrink: 0;
    margin-right: 10px;
    color: #333;
    text-align: left;
    font: {
      size: 16px;
      weight: 500;
    }
  }

  .el-input {
    padding: 0 20px;

    ::v-deep input {
      border-radius: 30px;
    }
  }

  &-controls {
    margin-left: 10px;
  }
}
</style>
