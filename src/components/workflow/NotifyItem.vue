<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-13 19:48:09
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-15 01:53:08
 * @Description: file content
-->
<template>
  <section class="workflow-item">
    <div class="workflow-item-box">
      <div class="workflow-item-content">
        <div class="workflow-item-content__information">
          <ul>
            <li><i class="el-icon-time"></i>发送至企业微信</li>
            <li><i class="el-icon-time"></i>发送至企业邮箱</li>
          </ul>
        </div>
        <div class="workflow-item-content__controls">
          <a><i class="el-icon-video-play" @click="runAction"></i></a>
          <a><i class="el-icon-setting" @click="setParams"></i></a>
          <a><i class="el-icon-delete" @click="deleteWorkflowItem"></i></a>
        </div>
      </div>
      <div class="workflow-item-footer">
        <span>通 知</span>
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
  name: 'NotifyWorkflowItem',
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
      runOneItem({ action: 'Notify', params: this.params })
    },
    deleteWorkflowItem() {
      deleteWorkflowItem({ id: this.id, action: 'Notify' })
      this.$emit('refresh')
    },
    setParams() {
      this.$emit('set', 'Notify')
    },
    insert() {
      this.$emit('insert', 'Notify')
    }
  }
}
</script>

<style lang="scss" scoped>
@import './item.scss';
</style>
