<!--
 * @Author: Whzcorcd
 * @Date: 2021-02-03 17:27:27
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-02-03 17:30:15
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

const NAME = 'PackImages'
const INFO = {
  title: ' 镜像打包',
  pointerList: ['连接容器镜像服务', '打包项目']
}

export default {
  name: 'PackImagesWorkflowItem',
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
