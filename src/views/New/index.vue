<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-14 12:48:23
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-07 16:35:53
 * @Description: file content
-->
<template>
  <div class="new">
    <Topbar subtitle="新增项目"></Topbar>
    <StatusBar content=""></StatusBar>
    <section class="new-content">
      <el-form
        class="new-form"
        label-position="top"
        label-width="80px"
        size="mini"
        :model="newProjectData"
      >
        <el-form-item><p class="new-form__topic">项目资料</p></el-form-item>
        <el-form-item label="项目中文名">
          <el-input v-model="newProjectData.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="Gitlab 仓库名">
          <el-input v-model="newProjectData.projectName" readonly></el-input>
        </el-form-item> -->
        <el-form-item label="Jenkins 任务名">
          <el-input v-model="newProjectData.jobName"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button
            type="primary"
            size="mini"
            :loading="btnLoading"
            @click="add"
          >
            添 加
          </el-button>
          <el-button type="default" size="mini" @click="reset">
            重 置
          </el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { addRecord } from '#/plugins/data'
import { parseXml } from '@/utils'
import { getJobInfo, getJobConfig } from '@/plugins/jenkins'
import { getProject } from '@/plugins/gitlab'
import Topbar from '@/common/topbar'
import StatusBar from '@/common/statusbar'

export default {
  name: 'New',
  components: { Topbar, StatusBar },
  data() {
    return {
      btnLoading: false,
      newProjectData: { name: '', projectName: '', jobName: '' }
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
    async add() {
      this.btnLoading = true
      try {
        const jobConfig = await getJobConfig(this.newProjectData.jobName)
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
        this.$set(this.newProjectData, 'projectName', repoName[1])

        const jobInfo = await getJobInfo(this.newProjectData.jobName)
        const { nextBuildNumber, lastSuccessfulBuild } = jobInfo.data
        const number = lastSuccessfulBuild ? lastSuccessfulBuild.number : 0
        const url = lastSuccessfulBuild ? lastSuccessfulBuild.url : ''

        const projectInfo = await getProject(this.newProjectData.projectName)
        const projectData = projectInfo.data
        if (projectData.length > 1) {
          // 项目不唯一
          Message.error(
            `项目 ${this.newProjectData.projectName} 不唯一，请检查`
          )
          return
        }
        const { id, web_url } = projectData[0]

        addRecord(
          Object.assign(
            {},
            { attribute: this.newProjectData },
            { buildInfo: { number, nextBuildNumber, url } },
            { projectInfo: { id, url: web_url } }
          )
        )

        this.btnLoading = false
        this.isDeveloper && this.$router.push({ name: 'Home' })
        this.isPM && this.$router.push({ name: 'Check' })
      } catch (err) {
        console.log(err)
        Message.error(
          `项目 ${this.newProjectData.name} 新增失败，请检查项目是否存在或合法`
        )
        this.btnLoading = false
      }
    },
    reset() {
      this.newProjectData = { name: '', projectName: '', jobName: '' }
    }
  }
}
</script>

<style lang="scss" scoped>
.new {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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
