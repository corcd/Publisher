<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-13 21:31:43
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-14 20:57:36
 * @Description: file content
-->
<template>
  <section class="workflow-item">
    <div class="workflow-item-box">
      <div class="workflow-item-content">
        <div class="workflow-item-content__information">
          <ul>
            <li><i class="el-icon-time"></i>安装依赖</li>
            <li><i class="el-icon-time"></i>构建项目</li>
          </ul>
        </div>
        <div class="workflow-item-content__controls">
          <a><i class="el-icon-video-play" @click="runAction"></i></a>
          <a><i class="el-icon-setting" @click="setParams"></i></a>
          <a><i class="el-icon-delete" @click="deleteWorkflowItem"></i></a>
        </div>
      </div>
      <div class="workflow-item-footer">
        <span>构 建</span>
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
  name: 'EstablishWorkflowItem',
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
      runOneItem({ action: 'Establish', params: this.params })
    },
    deleteWorkflowItem() {
      deleteWorkflowItem({ id: this.id, action: 'Establish' })
      this.$emit('refresh')
    },
    setParams() {
      this.$emit('set', 'Establish')
    },
    insert() {
      this.$emit('insert', 'Establish')
    }
  }
}
</script>

<style lang="scss" scoped>
@import './item.scss';
</style>
