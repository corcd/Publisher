<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-13 19:42:43
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-15 02:20:12
 * @Description: file content
-->
<template>
  <div class="workflow">
    <Topbar subtitle="工作流设置"></Topbar>
    <StatusBar content=""></StatusBar>
    <div class="workflow-content">
      <!-- <DeployWorkflowItem :params="{}"></DeployWorkflowItem> -->
      <div class="workflow-content-item" @click="unshift">
        <i class="el-icon-circle-plus-outline"></i>
      </div>
      <component
        v-for="element in workflow"
        :key="element.action"
        :is="`${element.action}WorkflowItem`"
        :id="id"
        :params="element.params"
        @refresh="refreshData"
        @set="setParams"
        @insert="insert"
      ></component>
    </div>

    <el-dialog
      title="添加工作流"
      :visible.sync="dialogVisible"
      width="400px"
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
              v-for="i in selectOptions(id)"
              :key="i.value"
              :label="i.label"
              :value="i.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-divider
          v-if="paramsList(tempData.newAction).length > 0"
        ></el-divider>
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

    <el-dialog
      title="工作流配置"
      :visible.sync="subDialogVisible"
      width="400px"
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
          <p class="workflow-form__topic">参数设置</p>
        </el-form-item>
        <el-form-item
          v-for="item in Object.keys(tempData.params)"
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
        <el-form-item
          label="无数据"
          v-show="Object.keys(tempData.params).length === 0"
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" size="mini" @click="cancel">
          取 消
        </el-button>
        <el-button type="primary" size="mini" @click="update">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOneRecord,
  unshiftWorkflow,
  insertWorkflow,
  updateWorkflowParams
} from '#/plugins/lowdb'
import Topbar from '@/common/topbar'
import StatusBar from '@/common/statusbar'
import PublishWorkflowItem from '@/components/workflow/PublishItem'
import EstablishWorkflowItem from '@/components/workflow/EstablishItem'
import NotifyWorkflowItem from '@/components/workflow/NotifyItem'
import DeployWorkflowItem from '@/components/workflow/DeployItem'

export default {
  name: 'Workflow',
  components: {
    Topbar,
    StatusBar,
    PublishWorkflowItem,
    NotifyWorkflowItem,
    EstablishWorkflowItem,
    DeployWorkflowItem
  },
  data() {
    return {
      dialogVisible: false,
      subDialogVisible: false,
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
      },
      id: '',
      workflow: []
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
  created() {
    this.id = this.$route.params.id
  },
  mounted() {
    this.refreshData()
  },
  methods: {
    refreshData() {
      this.workflow = []
      this.workflow = getOneRecord(this.id).workflow
      console.log(this.workflow)
    },
    setParams(currentAction) {
      this.tempData.currentAction = currentAction
      // TODO 容错处理
      this.tempData.params = getOneRecord(this.id).workflow.filter(
        item => item.action === currentAction
      )[0].params
      this.subDialogVisible = true
    },
    unshift() {
      unshiftWorkflow({ id: this.id, action: 'Publish', params: {} })
      this.refreshData()
    },
    insert(currentAction) {
      this.tempData.currentAction = currentAction
      this.dialogVisible = true
    },
    clearTempData() {
      this.tempData = { currentAction: '', newAction: '', params: {} }
    },
    confirm() {
      console.log(this.tempData)
      insertWorkflow({
        id: this.id,
        currentAction: this.tempData.currentAction,
        newAction: this.tempData.newAction,
        params: this.tempData.params || {}
      })
      this.dialogVisible = false
      this.clearTempData()
    },
    update() {
      updateWorkflowParams({
        id: this.id,
        action: this.tempData.currentAction,
        newParams: this.tempData.params || {}
      })
      this.subDialogVisible = false
      this.clearTempData()
    },
    cancel() {
      this.dialogVisible = false
      this.subDialogVisible = false
      this.clearTempData()
    }
  }
}
</script>

<style lang="scss" scoped>
.workflow {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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
