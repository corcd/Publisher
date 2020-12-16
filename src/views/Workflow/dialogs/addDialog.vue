<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-16 15:09:54
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-16 15:26:25
 * @Description: file content
-->
<template>
  <el-dialog
    title="添加工作流"
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
      :model="tempData"
    >
      <el-form-item>
        <p class="workflow-form__topic">工作流选择</p>
      </el-form-item>
      <el-form-item label="工作流">
        <el-select
          v-model="tempData.newAction"
          size="mini"
          placeholder="请选择工作流"
        >
          <el-option
            v-for="item in selectOptions(id)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-divider v-if="paramsList(tempData.newAction).length > 0"></el-divider>
      <el-form-item v-show="paramsList(tempData.newAction).length > 0">
        <p class="workflow-form__topic">参数设置</p>
      </el-form-item>
      <el-form-item
        v-for="item in paramsList(tempData.newAction)"
        :key="item"
        :label="item"
      >
        <el-input
          type="text"
          size="mini"
          :placeholder="item"
          v-model="tempData.params[item]"
        ></el-input>
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

export default {
  name: 'AddDialog',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      original: [
        {
          value: 'Publish',
          label: '发布',
          params: []
        },
        {
          value: 'Establish',
          label: '构建',
          params: ['jobName']
        },
        {
          value: 'Notify',
          label: '通知',
          params: ['name', 'jobName', 'environment', 'updatedContent']
        },
        {
          value: 'Deploy',
          label: '部署',
          params: []
        }
      ],
      tempData: {
        currentAction: '',
        newAction: '',
        params: {}
      }
    }
  },
  computed: {
    selectOptions() {
      return id => {
        const workflow = getOneRecord(id).workflow
        const workflowActions = workflow.map(item => item.action)

        const original = new Set(this.original)

        original.forEach((item, index) => {
          if (workflowActions.includes(item.value)) {
            original.delete(item)
          }
        })

        console.log(original)
        return original
      }
    },
    paramsList() {
      return action => {
        return action
          ? this.original.filter(item => item.value === action)[0].params
          : []
      }
    }
  },
  methods: {
    open(currentAction = '') {
      this.tempData.currentAction = currentAction
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
      this.tempData = {
        currentAction: '',
        newAction: '',
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
