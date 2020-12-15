<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-14 12:48:23
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-14 14:35:55
 * @Description: file content
-->
<template>
  <div class="new">
    <Topbar subtitle="新增项目"></Topbar>
    <StatusBar content=""></StatusBar>
    <div class="new-content">
      <el-form
        class="new-form"
        label-position="top"
        label-width="80px"
        size="mini"
        :model="newProjectData"
      >
        <el-form-item><p class="new-form__topic">项目资料</p></el-form-item>
        <el-form-item label="项目名">
          <el-input v-model="newProjectData.name"></el-input>
        </el-form-item>
        <el-form-item label="工作任务名">
          <el-input v-model="newProjectData.jobName"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" size="mini" @click="add">添 加</el-button>
          <el-button type="default" size="mini" @click="reset">
            重 置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addRecord } from '#/plugins/lowdb'
import { getLastBuildNumber, getBuildInfo } from '@/plugins/jenkins'
import Topbar from '@/common/topbar'
import StatusBar from '@/common/statusbar'

export default {
  name: 'New',
  components: { Topbar, StatusBar },
  data() {
    return {
      newProjectData: { name: '', jobName: '' }
    }
  },
  beforeDestroy() {
    this.reset()
  },
  methods: {
    async add() {
      const res = await getLastBuildNumber(
        this.newProjectData.jobName
      ).catch(err => console.error(err))

      const buildInfo = await getBuildInfo(
        this.newProjectData.jobName,
        res.data
      ).catch(err => console.error(err))

      const { actions } = buildInfo.data
      const buildData = actions.filter(
        item => item._class === 'hudson.plugins.git.util.BuildData'
      )
      const remoteUrl = buildData ? buildData[0].remoteUrls[0] : ''
      const branchInfo = buildData
        ? buildData[0].lastBuiltRevision.branch[0]
        : { name: '( 无 )', SHA1: '( 无 )' }

      await addRecord(
        Object.assign({}, this.newProjectData, { branchInfo }, { remoteUrl })
      ).catch(err => console.error(err))

      this.$router.push({ name: 'Home' })
    },
    reset() {
      this.newProjectData = { name: '', jobName: '' }
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
