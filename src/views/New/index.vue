<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-14 12:48:23
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-07-23 15:35:44
 * @Description: file content
-->
<template>
  <div class="new">
    <Topbar subtitle="新增项目"></Topbar>
    <section class="container">
      <StatusBar content=""></StatusBar>
      <section class="new-content">
        <el-form
          class="new-form"
          label-position="top"
          label-width="80px"
          size="mini"
          :model="newProjectData.attribute"
        >
          <el-form-item><p class="new-form__topic">项目资料</p></el-form-item>
          <el-form-item label="项目中文名">
            <el-input v-model="newProjectData.attribute.name"></el-input>
          </el-form-item>
          <el-form-item label="Jenkins 任务名">
            <el-input v-model="newProjectData.attribute.jobName"></el-input>
          </el-form-item>
          <el-form-item label="全新的 Jenkins 项目">
            <el-switch v-model="newProjectData.isNewProject"></el-switch>
          </el-form-item>
          <el-form-item v-show="newProjectData.isNewProject" label=" 项目描述">
            <el-input
              v-model="newProjectData.attribute.description"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-show="newProjectData.isNewProject"
            label="Gitlab 仓库地址"
          >
            <el-input v-model="newProjectData.attribute.repoUrl"></el-input>
          </el-form-item>
          <el-form-item v-show="newProjectData.isNewProject" label="项目标识符">
            <el-input v-model="newProjectData.attribute.symbol"></el-input>
          </el-form-item>
          <el-form-item v-show="newProjectData.isNewProject" label="频道项目">
            <el-switch v-model="newProjectData.isPindaoProject"></el-switch>
          </el-form-item>
          <el-form-item v-show="newProjectData.isNewProject" label="构建命令行">
            <el-input
              v-model="newProjectData.attribute.prevCommand"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-show="newProjectData.isNewProject"
            label="构建后命令行"
          >
            <el-input
              v-model="newProjectData.attribute.postCommand"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
            ></el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-button
              type="primary"
              size="mini"
              :loading="btnLoading"
              @click="newProjectData.isNewProject ? create() : preAdd()"
            >
              添 加
            </el-button>
            <el-button type="default" size="mini" @click="reset">
              重 置
            </el-button>
          </el-form-item>
        </el-form>
      </section>
    </section>

    <SelectDialog
      ref="dialog"
      @confirm="confirm"
      @cancel="cancel"
    ></SelectDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { cloneDeep } from 'lodash-es'
import { addRecord } from '#/plugins/data'
import { parseXml } from '@/utils'
import { getJobInfo, getJobConfig, createJob } from '@/plugins/jenkins'
import { getProjectConfig } from '@/plugins/parser'
import { getProject } from '@/plugins/gitlab'
import Topbar from '@/common/topbar'
import StatusBar from '@/common/statusbar'
import SelectDialog from './dialogs/selectDialog'

const DEFAULT_PROJECT_DATA = {
  isNewProject: false,
  isPindaoProject: false,
  attribute: {
    name: '',
    projectName: '',
    jobName: '',
    description: '',
    repoUrl: '',
    symbol: '',
    prevCommand: `node -v
yarn
yarn $SCRIPT
cd dist
tar -zcvf dist.tar.gz ./*`,
    postCommand: 'rm -f dist.tar.gz'
  },
  buildInfo: { number: 0, nextBuildNumber: 0, url: '' }
}

export default {
  name: 'New',
  components: { Topbar, StatusBar, SelectDialog },
  data() {
    const newProjectData = cloneDeep(DEFAULT_PROJECT_DATA)
    return {
      btnLoading: false,
      newProjectData
    }
  },
  computed: {
    ...mapGetters('user', ['isDeveloper', 'isPM'])
  },
  mounted() {
    window.addEventListener(
      'keyup',
      e => {
        if (e.key === 'Enter') e.stopPropagation()
      },
      true
    )
  },
  beforeDestroy() {
    window.removeEventListener('keyup', e => {
      if (e.key === 'Enter') e.stopPropagation()
    })
    this.reset()
  },
  methods: {
    async create() {
      this.btnLoading = true
      try {
        this.newProjectData.attribute.projectName = this.newProjectData.attribute.jobName
        const repoNameFragmentGroup = this.newProjectData.attribute.repoUrl.match(
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})\/([/\w .-]*)\/([/\w .-]*)\.git$/
        )
        const projectInfoList = await getProject(repoNameFragmentGroup[5])
        const projectData = projectInfoList.data.find(
          item =>
            item.http_url_to_repo === this.newProjectData.attribute.repoUrl
        )
        const { id, web_url } = projectData
        const data = {
          projectName: this.newProjectData.attribute.projectName,
          description: this.newProjectData.attribute.description,
          source: {
            url: this.newProjectData.attribute.repoUrl
          },
          build: {
            prevCommand: this.newProjectData.attribute.prevCommand,
            postCommand: this.newProjectData.attribute.postCommand
          }
        }
        const config = await getProjectConfig(
          this.newProjectData.attribute.symbol,
          data,
          this.newProjectData.isPindaoProject
        )
        await createJob(this.newProjectData.attribute.projectName, config)

        this.add({ id, url: web_url })
        this.btnLoading = false
        // TODO 完成处理统一归化
        this.isDeveloper && this.$router.push({ name: 'Home' })
        this.isPM && this.$router.push({ name: 'Check' })
      } catch (err) {
        console.log(err)
        Message.error(
          `项目 ${this.newProjectData.attribute.name} 新增失败，请检查项目是否已存在或配置是否合法`
        )
        this.btnLoading = false
      }
    },
    async preAdd() {
      this.btnLoading = true
      try {
        const jobConfig = await getJobConfig(
          this.newProjectData.attribute.jobName
        )
        const parsedJobConfig = await parseXml(jobConfig.data)
        // 暂时只有一个仓库
        const gitUrl =
          parsedJobConfig.project.scm[0].userRemoteConfigs[0][
            'hudson.plugins.git.UserRemoteConfig'
          ][0].url[0] || ''
        const repoUrl = gitUrl.match(
          /http:\/\/gitlab\.aodianyun\.com\/*\/(\S*)\.git/i
        )
        const repoName = repoUrl[1].split('/')
        this.$set(this.newProjectData.attribute, 'projectName', repoName[1])

        const jobInfo = await getJobInfo(this.newProjectData.attribute.jobName)
        const { nextBuildNumber, lastSuccessfulBuild } = jobInfo.data
        const number = lastSuccessfulBuild ? lastSuccessfulBuild.number : 0
        const url = lastSuccessfulBuild ? lastSuccessfulBuild.url : ''
        this.$set(this.newProjectData.buildInfo, 'number', number)
        this.$set(
          this.newProjectData.buildInfo,
          'nextBuildNumber',
          nextBuildNumber
        )
        this.$set(this.newProjectData.buildInfo, 'url', url)

        const projectInfo = await getProject(
          this.newProjectData.attribute.projectName
        )
        const projectData = projectInfo.data
        if (projectData.length > 1) {
          // 项目不唯一，打开对话框
          console.log(projectData)
          this.$refs.dialog.open(projectData)
          return
        }
        const { id, web_url } = projectData[0]
        this.add({ id, url: web_url })
      } catch (err) {
        console.log(err)
        Message.error(
          `项目 ${this.newProjectData.attribute.name} 新增失败，请检查项目是否存在或合法`
        )
        this.btnLoading = false
      }
    },
    add({ id, url }) {
      try {
        addRecord(
          Object.assign(
            {},
            { attribute: this.newProjectData.attribute },
            { buildInfo: this.newProjectData.buildInfo },
            { projectInfo: { id, url } }
          )
        )

        this.btnLoading = false
        this.isDeveloper && this.$router.push({ name: 'Home' })
        this.isPM && this.$router.push({ name: 'Check' })
      } catch (err) {
        console.log(err)
        Message.error(`项目 ${this.newProjectData.attribute.name} 新增失败`)
        this.btnLoading = false
      }
    },
    confirm(target) {
      const { id, name, url } = target
      this.$set(this.newProjectData.attribute, 'projectName', name)
      this.$refs.dialog.close()
      this.add({ id, url })
    },
    cancel() {
      this.reset({ partial: true })
      this.btnLoading = false
      this.$refs.dialog.close()
    },
    reset({ partial = false }) {
      if (partial) {
        this.$set(this.newProjectData.buildInfo, 'number', 0)
        this.$set(this.newProjectData.buildInfo, 'nextBuildNumber', 0)
        this.$set(this.newProjectData.buildInfo, 'url', '')
        return
      }

      this.newProjectData = Object.assign({}, DEFAULT_PROJECT_DATA)
    }
  }
}
</script>

<style lang="scss" scoped>
.new {
  position: relative;
  width: 100%;
  height: 100%;

  .container {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
  }

  &-content {
    flex-grow: 1;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    padding: 16px 36px 36px 36px;
  }

  &-form {
    width: 70%;

    &::v-deep .new-form__topic {
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
