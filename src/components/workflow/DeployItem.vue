<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-13 21:38:42
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-02-05 17:38:25
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

const NAME = 'Deploy'
const INFO = {
  title: '容器部署',
  pointerList: ['连接 Kubernetes', '热更替部署项目']
}

export default {
  name: 'DeployWorkflowItem',
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
