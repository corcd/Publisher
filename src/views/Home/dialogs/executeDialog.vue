<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-16 12:33:40
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-16 14:24:53
 * @Description: file content
-->
<template>
  <el-dialog
    title="执行工作流"
    :visible.sync="dialogVisible"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    center
  >
    <el-input
      type="textarea"
      :rows="3"
      placeholder="请输入更新内容，一个条目单独一行"
      v-model="postTempData.text"
    >
    </el-input>
    <el-select
      v-model="postTempData.environment"
      size="mini"
      placeholder="请选择"
    >
      <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button type="default" size="mini" @click="cancel">
        取 消
      </el-button>
      <el-button type="primary" size="mini" @click="confirm">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ExecuteDialog',
  data() {
    return {
      dialogVisible: false,
      selectOptions: [
        {
          value: 'development',
          label: '测试环境'
        },
        {
          value: 'preview',
          label: '预发环境'
        },
        {
          value: 'production',
          label: '生产环境'
        }
      ],
      postTempData: {
        text: '',
        environment: 'development'
      }
    }
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
      this.postTempData = {
        text: '',
        environment: 'development'
      }
    },
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      this.$emit('confirm', this.postTempData)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
  .el-select {
    margin-top: 10px;
  }
}
</style>
