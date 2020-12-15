<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:01:15
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-15 10:25:27
 * @Description: file content
-->
<template>
  <div class="home">
    <Topbar @change="freshData"></Topbar>
    <Searchbar></Searchbar>
    <section>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item
          v-for="item in records"
          :key="item.id"
          :title="getTitle({ name: item.name, jobName: item.jobName })"
          :name="item.id"
        >
          <div class="home-collapse">
            <div class="home-collapse__left">
              <p class="home-collapse__details">
                最近一次构建:
                {{
                  `&lt;${
                    item.branchInfo ? item.branchInfo.name : '( 无 )'
                  }&gt; ${item.branchInfo ? item.branchInfo['SHA1'] : '( 无 )'}`
                }}
              </p>
              <p class="home-collapse__details">
                远程地址:
                {{ item.remoteUrl || '( 无 )' }}
              </p>
            </div>
            <div class="home-collapse__right">
              <el-button
                type="primary"
                size="mini"
                @click="preExecute(item.id)"
              >
                执行
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="leadToWorkflowPage(item.id)"
              >
                工作流
              </el-button>
              <el-button type="danger" size="mini" @click="deleteData(item.id)">
                删除
              </el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </section>

    <el-dialog
      title="执行工作流"
      :visible.sync="dialogVisible"
      width="400px"
      center
    >
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入更新内容，一个条目单独一行"
        v-model="tempData.text"
      >
      </el-input>
      <el-select
        v-model="tempData.environment"
        size="mini"
        placeholder="请选择"
      >
        <el-option
          v-for="i in selectOptions"
          :key="i.value"
          :label="i.label"
          :value="i.value"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" size="mini" @click="cancel">
          取 消
        </el-button>
        <el-button type="primary" size="mini" @click="execute">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRecords,
  getOneRecord,
  delRecord,
  updateNotifyWorkflowParams
} from '#/plugins/lowdb'
import { runWorkflow } from '@/modules/task'
import Topbar from '@/components/home/topbar'
import Searchbar from '@/components/home/searchbar'

export default {
  name: 'Home',
  components: { Topbar, Searchbar },
  data() {
    return {
      dialogVisible: false,
      activeName: '',
      tempData: {
        id: '',
        text: '',
        environment: 'development'
      },
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
      records: []
    }
  },
  computed: {
    getTitle() {
      return ({ name, jobName }) => {
        return `${name || '暂无名称'} ( ${jobName || '暂无工作任务名称'} )`
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
      this.records = []
      this.records.push(...getRecords)
    },
    preExecute(id) {
      this.tempData.id = id
      if (this.hasNotifyWorkflowItem(this.tempData.id)) {
        this.dialogVisible = true
        return
      }
      return this.execute()
    },
    async execute() {
      if (!this.tempData.id) {
        console.error('工作流执行 id 错误')
        return
      }

      const { workflow } = getOneRecord(this.tempData.id)

      if (this.hasNotifyWorkflowItem(this.tempData.id)) {
        const environment = this.selectOptions.filter(
          item => item.value === this.tempData.environment
        )[0].label

        updateNotifyWorkflowParams({
          id: this.tempData.id,
          environment,
          updatedContent: this.tempData.text
        })
      }

      try {
        const res = await runWorkflow(workflow)
        console.log(res)
        this.dialogVisible = false
        this.clearTempData()
      } catch (err) {
        console.error(err)
      }
    },
    cancel() {
      this.dialogVisible = false
      this.clearTempData()
    },
    clearTempData() {
      this.tempData = {
        id: '',
        text: '',
        environment: 'development'
      }
    },
    async deleteData(id) {
      try {
        await delRecord({ id })
        this.freshData()
      } catch (err) {
        console.error(err)
      }
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

    &__left {
      width: 50%;
    }

    &__details {
      width: 100%;
      padding: 5px 0;
      color: #999;
      text-align: left;
      font: {
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
