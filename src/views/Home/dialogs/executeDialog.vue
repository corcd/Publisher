<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-16 12:33:40
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-18 15:05:44
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
    <el-form
      class="home-form"
      label-position="top"
      label-width="80px"
      size="mini"
    >
      <el-form-item label="更新内容" v-if="hasNotifyWorkflowItem(id)">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入更新内容，一个条目单独一行"
          v-model="prevExecuteData.text"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="发布环境">
        <el-select
          v-model="prevExecuteData.environment"
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
      </el-form-item>
    </el-form>
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
import { getOneRecord } from '#/plugins/lowdb'
import { originalEnvTypes } from '@/modules/task'

export default {
  name: 'ExecuteDialog',
  data() {
    return {
      dialogVisible: false,
      selectOptions: Object.freeze(originalEnvTypes),
      id: '',
      prevExecuteData: {
        text: '',
        environment: 'development'
      }
    }
  },
  computed: {
    hasNotifyWorkflowItem() {
      return id => {
        if (!id) return false

        const { workflow } = getOneRecord(id)
        const chosenList = workflow.filter(item => item.action === 'Notify')
        return chosenList.length > 0
      }
    }
  },
  methods: {
    open(id) {
      this.id = id
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
      this.prevExecuteData = {
        text: '',
        environment: 'development'
      }
    },
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      this.$emit('confirm', this.prevExecuteData)
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-form {
    width: 100%;

    &::v-deep .workflow-form__topic {
      width: 100%;
      text-align: left;
      font: {
        size: 14px;
        weight: 500;
      }
    }

    &::v-deep .el-divider--horizontal {
      margin: 12px 0;
    }

    &::v-deep .el-form-item {
      margin-bottom: 0px;
      padding-bottom: 10px;
      text-align: left;
    }

    &::v-deep .el-form-item__label {
      width: 100%;
      height: 24px;
      padding: 0;
      font: {
        size: 12px;
        weight: 500;
      }
      line-height: 24px;
    }
  }
}
</style>
