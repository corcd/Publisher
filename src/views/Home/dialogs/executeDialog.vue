<!--
 * @Author: Whzcorcd
 * @Date: 2020-12-16 12:33:40
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-07-21 16:27:06
 * @Description: file content
-->
<template>
  <el-dialog
    title="执行工作流"
    :visible.sync="dialogVisible"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    center
  >
    <el-form
      class="home-form"
      label-position="top"
      label-width="80px"
      size="mini"
    >
      <el-form-item>
        <p class="home-form__topic">参数设置</p>
      </el-form-item>
      <el-form-item label="更新内容" v-if="hasSuchParams('updatedContent')">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入更新内容，一个条目单独一行"
          v-model="prevExecuteData['updatedContent']"
          @change="updateTextCache"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="额外参数" v-if="hasSuchParams('extra')">
        <el-input
          type="text"
          placeholder="传递至 CI 的额外参数"
          v-model="prevExecuteData['extra']"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="发布环境" v-if="hasSuchParams('environment')">
        <el-select
          size="mini"
          placeholder="请选择"
          v-model="prevExecuteData['environment']"
          @change="handleSelectChange"
        >
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          class="home-form__tagname"
          type="text"
          placeholder="可选标签名"
          v-model="prevExecuteData['tagName']"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="提醒" v-if="hasSuchParams('mentionedList')">
        <el-select
          size="mini"
          placeholder="可选提醒产品经理"
          v-model="prevExecuteData['mentionedMobile']"
        >
          <el-option
            v-for="item in pmList"
            :key="item.name"
            :label="item.name"
            :value="item.mobile"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="镜像仓库命名空间"
        v-if="hasSuchParams('RepoNamespace')"
      >
        <el-input
          type="text"
          placeholder="请输入镜像仓库命名空间"
          v-model="prevExecuteData['RepoNamespace']"
        ></el-input>
      </el-form-item>
      <el-form-item label="镜像仓库名" v-if="hasSuchParams('RepoName')">
        <el-input
          type="text"
          placeholder="请输入镜像仓库名"
          v-model="prevExecuteData['RepoName']"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="当前环境对应分支存在未合并/未关闭的 MR，请及时处理"
        v-show="untreated"
      ></el-form-item>
      <el-form-item
        label="当前时间并非合理的升级时间，升级生产环境请慎重"
        v-show="
          prevExecuteData['environment'] && !isRationalProductionUpdateTime
        "
      ></el-form-item>
      <el-form-item
        label="无参数"
        v-show="uniqueParamsList.length === 0"
      ></el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="default" size="mini" @click="cancel">
        取 消
      </el-button>
      <el-button
        type="primary"
        size="mini"
        :disabled="btnDisabled"
        @click="confirm"
      >
        执 行
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import dayjs from 'dayjs'
// import { Message } from 'element-ui'
import { getOneRecord } from '#/plugins/data'
import { pmList } from '@/config'
import { originalEnvTypes, originalTasksTypes } from '@/modules/task/types'
import { getProject, listMergeRequests } from '@/plugins/gitlab'

export default {
  name: 'ExecuteDialog',
  data() {
    return {
      dialogVisible: false,
      pmList: Object.freeze(pmList),
      selectOptions: Object.freeze(originalEnvTypes),
      id: '',
      untreated: false,
      btnDisabled: true,
      uniqueParamsList: [],
      prevExecuteData: {},
      textCache: ''
    }
  },
  computed: {
    hasWorkflowItem() {
      return (id, action) => {
        if (!id || !action) return false

        const { workflow } = getOneRecord(id)
        const chosenList = workflow.filter(item => item.action === action)
        return chosenList.length > 0
      }
    },
    hasSuchParams() {
      return paramName => {
        return this.uniqueParamsList.includes(paramName)
      }
    },
    isRationalProductionUpdateTime() {
      const day = dayjs().day()
      if (this.prevExecuteData['environment'] && (day === 2 || day === 4)) {
        return true
      }
      return false
    }
  },
  methods: {
    async handleSelectChange(e) {
      // TODO 考虑根据任务附加参数指定是否需要该步骤
      this.btnDisabled = true
      const includedType = originalEnvTypes.find(item => item.value === e)
      // 当前分支
      const currentBranch = includedType ? includedType.branchName : 'master'

      const { attribute } = getOneRecord(this.id)
      try {
        const getProjectRes = await getProject(attribute.projectName)
        const projectId = getProjectRes.data[0].id
        const mergeRequestListRes = await listMergeRequests(projectId, {})
        const existedMergeRequest = mergeRequestListRes.data.filter(
          item => item.target_branch === currentBranch
        )
        if (existedMergeRequest.length > 0) {
          // 当前分支存在 MR
          this.untreated = true
          return
        }
      } catch (err) {
        console.error(err)
        return
      }
      this.untreated = false
      this.btnDisabled = false
    },
    open(id) {
      const { workflow } = getOneRecord(id)
      const actionsList = workflow.map(item => item.action)

      const paramsList = actionsList.map(item =>
        originalTasksTypes
          .find(ele => ele.value === item)
          .params.filter(ele => ele.prefixed)
      )

      for (const item in paramsList) {
        if (paramsList.hasOwnProperty(item)) {
          paramsList[item].forEach(ele => {
            if (this.uniqueParamsList.includes(ele.name)) return
            this.uniqueParamsList.push(ele.name)
            this.$set(this.prevExecuteData, ele.name, '')
          })
        }
      }

      // FEAT 更新内容输入框缓存
      if (this.textCache) {
        this.prevExecuteData['updatedContent'] = this.textCache
      }

      this.id = id
      this.dialogVisible = true
      if (this.uniqueParamsList.length === 0) {
        this.btnDisabled = false
      }
    },
    close() {
      this.dialogVisible = false
      this.untreated = false
      this.btnDisabled = false
      this.uniqueParamsList = []
      this.prevExecuteData = {}
    },
    cancel() {
      this.$emit('cancel')
    },
    confirm() {
      // for (const i in this.prevExecuteData) {
      //   if (this.prevExecuteData.hasOwnProperty(i)) {
      //     if (String.prototype.trim.call(this.prevExecuteData[i]) === '') {
      //       Message.error('参数不完整，请补充后重新提交')
      //       return
      //     }
      //   }
      // }
      this.$emit('confirm', this.prevExecuteData)
    },
    updateTextCache() {
      this.textCache = this.prevExecuteData['updatedContent']
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-form {
    width: 100%;

    ::v-deep &__topic {
      width: 100%;
      text-align: left;
      font: {
        size: 14px;
        weight: 500;
      }
    }

    ::v-deep &__tagname {
      display: inline-block;
      width: 120px;
      margin: 0 10px;
    }

    ::v-deep .el-divider--horizontal {
      margin: 12px 0;
    }

    ::v-deep .el-form-item {
      margin-bottom: 0px;
      padding-bottom: 10px;
      text-align: left;
    }

    ::v-deep .el-form-item__label {
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
