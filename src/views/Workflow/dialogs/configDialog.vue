<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-16 15:10:13
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-24 17:30:48
 * @Description: file content
-->
<template>
  <el-dialog
    title="工作流配置"
    :visible.sync="dialogVisible"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    center
  >
    <el-form
      class="workflow-form"
      label-position="top"
      label-width="80px"
      size="mini"
      :model="tempData.params"
    >
      <el-form-item>
        <p class="workflow-form__topic">参数设置</p>
      </el-form-item>
      <el-form-item
        v-for="item in Object.keys(tempData.params)"
        :key="item"
        :label="item"
        :prop="item"
        :required="isRequired(item)"
      >
        <el-input
          type="text"
          size="mini"
          :placeholder="item"
          v-model="tempData.params[item]"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="无数据"
        v-show="Object.keys(tempData.params).length === 0"
      ></el-form-item>
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
import { originalTasksTypes } from '@/modules/task/types'

export default {
  name: 'ConfigDialog',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      tempData: {
        currentAction: '',
        params: {}
      }
    }
  },
  computed: {
    isRequired() {
      return key => {
        const item = originalTasksTypes.find(
          element => element.value === this.tempData.currentAction
        )
        const target = item.params.find(element => element.name === key)

        return target ? target.required : false
      }
    }
  },
  methods: {
    open(currentAction) {
      this.tempData.currentAction = currentAction
      // TODO 容错处理
      this.tempData.params = getOneRecord(this.id).workflow.filter(
        item => item.action === currentAction
      )[0].params
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
      this.tempData = {
        currentAction: '',
        params: {}
      }
    },
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      this.$emit('confirm', this.tempData)
    }
  }
}
</script>

<style lang="scss" scoped>
.workflow {
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

  &-content {
    flex-grow: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 36px 36px 36px;

    &-item {
      flex-shrink: 0;
      width: 35px;
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f7f7f7;
      border-radius: 4px;
      cursor: pointer;

      i {
        color: #a3a3a3;
      }
    }
  }
}
</style>
