<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:01:15
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-16 17:13:03
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
            {{ getTitle({ name: item.name, jobName: item.jobName }) }}
            <i
              class="home-collapse__headericon home-collapse__headericon--completed el-icon-circle-check"
              v-if="getRecordStatus(item.id) === 'completed'"
            ></i>
            <i
              class="home-collapse__headericon home-collapse__headericon--error el-icon-circle-close"
              v-if="getRecordStatus(item.id) === 'error'"
            ></i>
          </template>
          <div class="home-collapse">
            <div class="home-collapse__left">
              <p class="home-collapse__details">
                最近一次构建:
                {{
                  `&lt;${
                    item.branchInfo ? item.branchInfo.name : '( 无 )'
                  }&gt; ${item.branchInfo ? item.branchInfo['SHA1'] : '( 无 )'}`
                }}
                <i
                  class="home-collapse__icons el-icon-document-copy"
                  @click="
                    copyDocument(item.branchInfo ? item.branchInfo['SHA1'] : '')
                  "
                ></i>
              </p>
              <p class="home-collapse__details">
                远程地址:
                {{ item.remoteUrl || '( 无 )' }}
                <i
                  class="home-collapse__icons el-icon-document-copy"
                  @click="copyDocument(item.remoteUrl || '')"
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
  </div>
</template>

<script>
import {
  getRecords,
  getOneRecord,
  delRecord,
  updateNotifyWorkflowParams
} from '#/plugins/lowdb'
import { setText } from '@/app/clipboard'
import { runWorkflow } from '@/modules/task'
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
      recordsData: [],
      recordsStatusData: null
    }
  },
  computed: {
    getTitle() {
      return ({ name, jobName }) => {
        return `${name || '暂无名称'} ( ${jobName || '暂无工作任务名称'} )`
      }
    },
    getRecordStatus() {
      return id => {
        // eslint-disable-next-line no-unused-vars
        const temp = this.defaultMapChangeTracker
        return this.recordsStatusData.has(id)
          ? this.recordsStatusData.get(id)
          : ''
      }
    },
    hasNotifyWorkflowItem() {
      return id => {
        const { workflow } = getOneRecord(id)
        const chosenList = workflow.filter(item => item.action === 'Notify')
        return chosenList.length > 0
      }
    }
  },
  mounted() {
    this.freshData()
  },
  methods: {
    freshData() {
      this.recordsData = []
      const records = JSON.parse(JSON.stringify(getRecords))

      this.recordsData.push(...getRecords)
      if (!this.recordsStatusData) {
        this.recordsStatusData = new Map([
          ...records.map(item => {
            return [
              String(item.id), // key -> id
              '' // value -> status
            ]
          })
        ])
      } else {
        for (const i in records) {
          if (!this.recordsStatusData.has(i.id)) {
            this.recordsStatusData.set(String(i.id), '')
          }
        }
      }
      this.defaultMapChangeTracker++
      console.log(this.recordsData)
    },
    copyDocument(text) {
      setText(text)
    },
    preExecute(id) {
      this.activeId = id
      if (this.hasNotifyWorkflowItem(this.activeId)) {
        this.$refs.dialog.open()
        return
      }
      return this.execute()
    },
    async execute(postTempData) {
      console.log(postTempData)

      if (!this.activeId) {
        console.error('工作流执行 id 错误')
        return
      }

      const { workflow } = getOneRecord(this.activeId)

      if (this.hasNotifyWorkflowItem(this.activeId)) {
        const environment = this.selectOptions.filter(
          item => item.value === postTempData.environment
        )[0].label

        updateNotifyWorkflowParams({
          id: this.activeId,
          environment,
          updatedContent: postTempData.text
        })
      }

      try {
        const res = await runWorkflow(workflow)
        console.log(res)
        this.$refs.dialog.close()

        // TODO 可以优化复用 recordsStatusData 更新策略
        if (res.every(item => item.status === 'fulfilled')) {
          if (this.recordsStatusData.has(String(this.activeId))) {
            this.recordsStatusData.set(String(this.activeId), 'completed')
          }
        } else {
          if (this.recordsStatusData.has(String(this.activeId))) {
            this.recordsStatusData.set(String(this.activeId), 'error')
          }
        }

        this.clearTempData()
      } catch (err) {
        console.error(err)
        if (this.recordsStatusData.has(String(this.activeId))) {
          this.recordsStatusData.set(String(this.activeId), 'error')
        }
      }
      this.defaultMapChangeTracker++
      console.log(this.recordsStatusData)
    },
    cancel() {
      this.$refs.dialog.close()
      this.clearTempData()
    },
    clearTempData() {
      this.activeId = ''
    },
    async deleteData(id) {
      try {
        await delRecord({ id })
      } catch (err) {
        console.error(err)
      }
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
