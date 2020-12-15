<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-13 21:38:42
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-15 02:05:26
 * @Description: file content
-->
<template>
  <section class="workflow-item">
    <div class="workflow-item-box">
      <div class="workflow-item-content">
        <div class="workflow-item-content__information">
          <ul>
            <li><i class="el-icon-time"></i>连接服务器</li>
            <li><i class="el-icon-time"></i>热更替部署项目</li>
          </ul>
        </div>
        <div class="workflow-item-content__controls">
          <a><i class="el-icon-video-play" @click="runAction"></i></a>
          <a><i class="el-icon-setting" @click="setParams"></i></a>
          <a><i class="el-icon-delete" @click="deleteWorkflowItem"></i></a>
        </div>
      </div>
      <div class="workflow-item-footer">
        <span>部 署</span>
      </div>
      <div class="workflow-item-item">
        <i class="el-icon-circle-plus-outline"></i>
      </div>
    </div>
    <div class="workflow-item-item" @click="insert">
      <i class="el-icon-circle-plus-outline"></i>
    </div>
  </section>
</template>

<script>
import { deleteWorkflowItem } from '#/plugins/lowdb'
import { runOneItem } from '@/modules/task'

export default {
  name: 'DeployWorkflowItem',
  props: {
    id: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: null
    }
  },
  data() {
    return {}
  },
  methods: {
    runAction() {
      runOneItem({ action: 'Deploy', params: this.params })
    },
    deleteWorkflowItem() {
      deleteWorkflowItem({ id: this.id, action: 'Deploy' })
      this.$emit('refresh')
    },
    setParams() {
      this.$emit('set', 'Deploy')
    },
    insert() {
      this.$emit('insert', 'Deploy')
    }
  }
}
</script>

<style lang="scss" scoped>
@import './item.scss';
</style>
