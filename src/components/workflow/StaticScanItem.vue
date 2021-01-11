<!--
 * @Author: Whzcorcd
 * @Date: 2021-01-09 10:54:38
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-09 10:55:35
 * @Description: file content
-->
<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-18 10:15:40
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-18 10:43:37
 * @Description: file content
-->
<template>
  <section class="workflow-item">
    <div class="workflow-item-box">
      <div class="workflow-item-content">
        <div class="workflow-item-content__information">
          <ul>
            <li v-for="item in workflowItemInfo.pointerList" :key="item">
              <i class="el-icon-time"></i>{{ item }}
            </li>
          </ul>
        </div>
        <div class="workflow-item-content__controls">
          <a><i class="el-icon-video-play" @click="runAction"></i></a>
          <a><i class="el-icon-setting" @click="setParams"></i></a>
          <a><i class="el-icon-delete" @click="deleteWorkflowItem"></i></a>
        </div>
      </div>
      <div class="workflow-item-footer">
        <span>{{ workflowItemInfo.title }}</span>
      </div>
    </div>
    <div class="workflow-item-item" @click="insert">
      <i class="el-icon-circle-plus-outline"></i>
    </div>
  </section>
</template>

<script>
import methods from './mixin/methods'

const NAME = 'StaticScan'
const INFO = {
  title: '静态扫描',
  pointerList: ['代码质量检查', '代码漏洞扫描']
}

export default {
  name: 'StaticScanWorkflowItem',
  data() {
    return {
      workflowItemName: NAME,
      workflowItemInfo: Object.freeze(INFO)
    }
  },
  mixins: [methods]
}
</script>

<style lang="scss" scoped>
@import './item.scss';
</style>
