<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-13 21:38:15
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-15 02:05:38
 * @Description: file content
-->
<template>
  <section class="workflow-item">
    <div class="workflow-item-box">
      <div class="workflow-item-content">
        <div class="workflow-item-content__information">
          <ul>
            <li><i class="el-icon-time"></i>Gitlab 仓库同步</li>
            <li><i class="el-icon-time"></i>版本号更新</li>
          </ul>
        </div>
        <div class="workflow-item-content__controls">
          <a><i class="el-icon-video-play" @click="runAction"></i></a>
          <a><i class="el-icon-setting" @click="setParams"></i></a>
          <a><i class="el-icon-delete" @click="deleteWorkflowItem"></i></a>
        </div>
      </div>
      <div class="workflow-item-footer">
        <span>发 布</span>
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
  name: 'PublishWorkflowItem',
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
      runOneItem({ action: 'Publish', params: this.params })
    },
    setWorkflowItem() {
      // TODO
    },
    deleteWorkflowItem() {
      deleteWorkflowItem({ id: this.id, action: 'Publish' })
      this.$emit('refresh')
    },
    setParams() {
      this.$emit('set', 'Publish')
    },
    insert() {
      this.$emit('insert', 'Publish')
    }
  }
}
</script>

<style lang="scss" scoped>
@import './item.scss';
</style>
