<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:01:15
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-30 16:25:49
 * @Description: file content
-->
<template>
  <div class="home">
    <Topbar @change="freshData"></Topbar>
    <Searchbar></Searchbar>
    <section>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item
          v-for="item in recordsData"
          :key="item.id"
          :name="item.id"
        >
          <template slot="title">
            {{
              getTitle({
                name: item.attribute.name,
                jobName: item.attribute.jobName
              })
            }}
            <span class="home-collapse__subtitle">
              [
              {{
                item.workflow.length
                  ? `${item.workflow.length} 任务数`
                  : '请添加任务'
              }}
              ]
            </span>
            <i
              class="home-collapse__headericon el-icon-loading"
              v-if="getRecordStatus(item.id) === 'loading'"
            ></i>
            <i
              class="home-collapse__headericon home-collapse__headericon--completed el-icon-circle-check"
              v-if="getRecordStatus(item.id) === 'completed'"
            ></i>
            <el-popover
              placement="right"
              width="200"
              trigger="hover"
              :content="getRecordWorkflowHistory(item.id)"
            >
              <i
                slot="reference"
                class="home-collapse__headericon home-collapse__headericon--error el-icon-circle-close"
                v-if="getRecordStatus(item.id) === 'error'"
              ></i>
            </el-popover>
          </template>
          <div class="home-collapse">
            <div class="home-collapse__left">
              <p class="home-collapse__details">
                最近任务完成时间:
                {{ formatTimeStamp(item.attackTime) || '( 无 )' }}
              </p>
              <p class="home-collapse__details">
                最近一次成功构建:
                {{
                  `&lt;${
                    item.buildInfo ? item.buildInfo.number : '( 无 )'
                  }&gt; ${item.buildInfo ? item.buildInfo.url : '( 无 )'}`
                }}
                <i
                  class="home-collapse__icons el-icon-document-copy"
                  @click="
                    copyDocument(item.buildInfo ? item.buildInfo.url : '')
                  "
                ></i>
              </p>
              <p class="home-collapse__details">
                下一次构建编号:
                {{
                  `&lt;${
                    item.buildInfo ? item.buildInfo.nextBuildNumber : '( 无 )'
                  }&gt;`
                }}
              </p>
              <p class="home-collapse__details">
                远程仓库地址:
                {{ item.projectInfo.url || '( 无 )' }}
                <i
                  class="home-collapse__icons el-icon-document-copy"
                  @click="copyDocument(item.projectInfo.url || '')"
                ></i>
              </p>
            </div>
            <div class="home-collapse__right">
              <i
                class="home-collapse__controls home-collapse__icons el-icon-video-play"
                @click="preExecute(item.id)"
              ></i>
              <i
                class="home-collapse__controls home-collapse__icons el-icon-setting"
                @click="leadToWorkflowPage(item.id)"
              ></i>
              <i
                class="home-collapse__controls home-collapse__icons home-collapse__icons--danger el-icon-delete"
                @click="deleteData(item.id)"
              ></i>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </section>

    <ExecuteDialog
      ref="dialog"
      @confirm="execute"
      @cancel="cancel"
    ></ExecuteDialog>

    <!-- <ErrorDialog ref="error"></ErrorDialog> -->
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
import {
  resetDataBase,
  getRecords,
  getOneRecord,
  delRecord,
  updateRecordAttackTime,
  updateAllWorkflowParams
} from '#/plugins/data'
import { setText } from '@/app/clipboard'
import { originalEnvTypes } from '@/modules/task/types'
import { runWorkflowRefactored } from '@/modules/task'
import Topbar from '@/components/home/topbar'
import Searchbar from '@/components/home/searchbar'
import ExecuteDialog from './dialogs/executeDialog'

export default {
  name: 'Home',
  components: { Topbar, Searchbar, ExecuteDialog },
  data() {
    return {
      defaultMapChangeTracker: 0,
      activeName: '',
      activeId: '',
      selectOptions: Object.freeze(originalEnvTypes),
      recordsData: [],
      recordsStatusData: null
    }
  },
  computed: {
    ...mapState('task', {
      ongoingTasks: state => state.ongoingTasks,
      failedTasks: state => state.failedTasks,
      completedTasks: state => state.completedTasks,
      taskHistory: state => state.taskHistory
    }),
    getTitle() {
      return ({ name = '', jobName = '' }) => {
        return `${name || '暂无名称'} ( ${jobName || '暂无工作任务名称'} )`
      }
    },
    getRecordStatus() {
      return id => {
        // eslint-disable-next-line no-unused-vars
        // const temp = this.defaultMapChangeTracker
        // return this.recordsStatusData.has(id)
        //   ? this.recordsStatusData.get(id)
        //   : ''
        let status = 'standby'
        if (this.ongoingTasks.includes(id)) status = 'loading'
        if (this.failedTasks.includes(id)) status = 'error'
        if (this.completedTasks.includes(id)) status = 'completed'
        return status
      }
    },
    getRecordWorkflowHistory() {
      return id => {
        const history = this.taskHistory.filter(item => item.id === id)
        console.log(history)
        return history.length > 0
          ? history[history.length - 1].result
          : '（无）'
      }
    },
    formatTimeStamp() {
      return timestamp => {
        return dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
    }
    // hasWorkflowItem() {
    //   return (id, action) => {
    //     if (!id || !action) return false

    //     const { workflow } = getOneRecord(id)
    //     const chosenList = workflow.filter(item => item.action === action)
    //     return chosenList.length > 0
    //   }
    // }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name !== 'Log' || from.name !== 'New') {
      to.meta.isInitial = true
    }
    next()
  },
  activated() {
    if (this.$route.meta.isInitial) {
      this.freshData()
    } else {
      // 取缓存数据
    }
    if (
      this.recordsData.length > 0 &&
      !this.recordsData.every(item => item.hasOwnProperty('attribute'))
    ) {
      MessageBox.alert('项目数据格式已过期，请重新录入', '数据错误', {
        confirmButtonText: '重置项目数据',
        callback: () => {
          resetDataBase()
          this.freshData()
        }
      })
    }
  },
  methods: {
    freshData() {
      this.recordsData = []
      // const records = JSON.parse(JSON.stringify(getRecords()))

      this.recordsData.push(...getRecords())
      // if (!this.recordsStatusData) {
      //   this.recordsStatusData = new Map([
      //     ...records.map(item => {
      //       return [
      //         String(item.id), // key -> id
      //         'standby' // value -> status
      //       ]
      //     })
      //   ])
      // } else {
      //   for (const i in records) {
      //     if (!this.recordsStatusData.has(i.id)) {
      //       this.recordsStatusData.set(String(i.id), '')
      //     }
      //   }
      // }
      // this.defaultMapChangeTracker++
      console.log(this.recordsData)
    },
    copyDocument(text) {
      setText(text)
    },
    // updateProjectStatus(id, status) {
    //   if (status) {
    //     if (
    //       this.recordsStatusData.has(String(id)) &&
    //       this.recordsStatusData.get(String(id)) === 'loading'
    //     ) {
    //       console.log('项目任务已在运行')
    //       return
    //     }
    //     this.recordsStatusData.set(String(id), 'loading')
    //     this.defaultMapChangeTracker++
    //     console.log(this.recordsStatusData)
    //     return
    //   }

    //   if (this.recordsStatusData.size < 1) {
    //     console.error('任务队列为空')
    //     return
    //   }

    //   if (this.recordsStatusData.has(String(id))) {
    //     this.recordsStatusData.set(String(id), 'standby')
    //     this.defaultMapChangeTracker++
    //     console.log(this.recordsStatusData)
    //     return
    //   }
    //   console.error('项目任务不存在')
    // },
    preExecute(id) {
      // TODO 判断优化
      this.activeId = id
      // if (
      //   this.hasWorkflowItem(id, 'Publish') ||
      //   this.hasWorkflowItem(id, 'Notify') ||
      //   this.hasWorkflowItem(id, 'ParametricBuild')
      // ) {
      this.$refs.dialog.open(id)
      return
      // }
      // return this.execute()
    },
    async execute(prevExecuteData = {}) {
      // prevExecuteData 构建前填写的参数
      console.log(prevExecuteData)
      const currentId = this.activeId
      if (!currentId) {
        console.error('工作流执行 id 错误')
        return
      }

      const { attribute, workflow } = getOneRecord(currentId)
      if (workflow.length === 0) {
        Message.warning('请先添加工作流后再执行任务')
        return
      }

      // this.updateProjectStatus(currentId, true)
      updateAllWorkflowParams({ id: currentId, globalParams: prevExecuteData })
      this.$refs.dialog.close()

      try {
        await runWorkflowRefactored(
          currentId,
          workflow,
          Object.assign({}, prevExecuteData, { ...attribute })
        )
        updateRecordAttackTime({ id: currentId })

        // if (this.recordsStatusData.has(String(currentId))) {
        //   this.recordsStatusData.set(String(currentId), 'completed')
        // }

        this.clearTempData()
      } catch (err) {
        console.error(err)
        // if (this.recordsStatusData.has(String(currentId))) {
        //   this.recordsStatusData.set(String(currentId), 'error')
        // }
      }

      // this.defaultMapChangeTracker++
    },
    cancel() {
      this.$refs.dialog.close()
      this.clearTempData()
    },
    clearTempData() {
      this.activeId = ''
    },
    deleteData(id) {
      delRecord({ id })
      this.freshData()
    },
    leadToWorkflowPage(id) {
      this.$router.push({
        name: 'Workflow',
        params: {
          id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;

  .el-dialog {
    .el-select {
      margin-top: 10px;
    }
  }

  &-collapse {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px 0 0 0;

    &__subtitle {
      margin-left: 10px;
      color: #999;
      font: {
        size: 12px;
      }
    }

    &__headericon {
      margin-left: 10px;
      font: {
        size: 14px;
      }

      &--completed {
        color: #0064c8;
      }

      &--error {
        color: red;
      }
    }

    &__left {
      width: 50%;
    }

    &__details {
      width: 100%;
      padding: 0 0 5px 0;
      color: #999;
      text-align: left;
      font: {
        size: 12px;
      }
    }

    &__controls {
      font: {
        size: 20px;
      }
    }

    &__icons {
      margin: 0 5px;
      color: #666;
      transition: all 0.2s linear;
      cursor: pointer;

      &:hover {
        color: #afafaf;
      }

      &--danger {
        color: red;

        &:hover {
          color: #ff9999;
        }
      }
    }

    &__right {
      width: 50%;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;

      .el-select {
        width: 100px;
        margin-right: 20px;
      }
    }
  }

  section {
    width: 100%;
    padding: 18px 36px;
  }
}
</style>
