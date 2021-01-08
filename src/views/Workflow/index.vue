<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-13 19:42:43
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-05 18:31:00
 * @Description: file content
-->
<template>
  <div class="workflow">
    <Topbar subtitle="工作流设置"></Topbar>
    <StatusBar content=""></StatusBar>
    <div class="workflow-recommend">
      <p>推荐流程：{{ recommend }}</p>
    </div>
    <div class="workflow-content">
      <div class="workflow-content-item" @click="unshiftWorkflowItem">
        <i class="el-icon-circle-plus-outline"></i>
      </div>
      <component
        v-for="element in workflow"
        :key="element.action"
        :is="`${element.action}WorkflowItem`"
        :id="id"
        :params="element.params"
        @refresh="refreshData"
        @set="setWorkflowItemParams"
        @insert="insertWorkflowItem"
      ></component>
    </div>

    <AddDialog
      ref="adddialog"
      :id="id"
      @confirm="addWorkflowItem"
      @cancel="cancel"
    ></AddDialog>

    <ConfigDialog
      ref="configdialog"
      :id="id"
      @confirm="updateWorkflowItemParams"
      @cancel="cancel"
    ></ConfigDialog>
  </div>
</template>

<script>
import {
  getOneRecord,
  unshiftWorkflow,
  insertWorkflow,
  updateWorkflowParams
} from '#/plugins/data'
import Topbar from '@/common/topbar'
import StatusBar from '@/common/statusbar'
import UpdateWorkflowItem from '@/components/workflow/UpdateItem'
import PublishWorkflowItem from '@/components/workflow/PublishItem'
import EstablishWorkflowItem from '@/components/workflow/EstablishItem'
import ParametricBuildWorkflowItem from '@/components/workflow/ParametricBuildItem'
import NotifyWorkflowItem from '@/components/workflow/NotifyItem'
import DeployWorkflowItem from '@/components/workflow/DeployItem'
import AddDialog from './dialogs/addDialog'
import ConfigDialog from './dialogs/configDialog'

export default {
  name: 'Workflow',
  components: {
    Topbar,
    StatusBar,
    UpdateWorkflowItem,
    PublishWorkflowItem,
    NotifyWorkflowItem,
    EstablishWorkflowItem,
    ParametricBuildWorkflowItem,
    DeployWorkflowItem,
    AddDialog,
    ConfigDialog
  },
  data() {
    return {
      recommend: '更新配置 - 静态扫描 - 参数化构建 - 发布 - 通知',
      id: '',
      workflow: []
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
    },
    setWorkflowItemParams(currentAction) {
      this.$refs.configdialog.open(currentAction)
    },
    unshiftWorkflowItem() {
      this.$refs.adddialog.open()
    },
    insertWorkflowItem(currentAction) {
      this.$refs.adddialog.open(currentAction)
    },
    addWorkflowItem(tempData) {
      console.log(tempData)
      if (!tempData.newAction) {
        return
      }

      if (!tempData.currentAction) {
        unshiftWorkflow({
          id: this.id,
          newAction: tempData.newAction,
          params: tempData.params || {}
        })
      } else {
        insertWorkflow({
          id: this.id,
          currentAction: tempData.currentAction,
          newAction: tempData.newAction,
          params: tempData.params || {}
        })
      }
      this.refreshData()
      this.$refs.adddialog.close()
    },
    updateWorkflowItemParams(tempData) {
      if (!tempData.currentAction) {
        return
      }

      updateWorkflowParams({
        id: this.id,
        action: tempData.currentAction,
        newParams: tempData.params || {}
      })
      this.refreshData()
      this.$refs.configdialog.close()
    },
    cancel() {
      this.$refs.configdialog.close()
      this.$refs.adddialog.close()
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

  &-recommend {
    flex-shrink: 0;
    width: 100%;
    height: 40px;
    padding: 0 36px;

    p {
      width: 100%;
      color: #999;
      font: {
        size: 14px;
        weight: 500;
      }
      text-align: center;
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
