/*
 * @Author: Whzcorcd
 * @Date: 2020-12-06 22:06:34
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-24 15:11:55
 * @Description: file content
 */
// TODO 替换为 nanoid
import { nanoid } from 'nanoid'
import { showNotification } from '*/notification'
import {
  getProjectId,
  compareBranches,
  listMergeRequests,
  deleteMergeRequest,
  createsNewMergeRequest
} from '@/plugins/gitlab'
import { build, buildWithParams } from '@/plugins/jenkins'
import { sendWechatNotification, sendEmailNotification } from '@/plugins/notify'

export const originalEnvTypes = [
  {
    value: 'development',
    label: '测试环境',
    branchName: 'test'
  },
  {
    value: 'preview',
    label: '预发环境',
    branchName: 'dev'
  },
  {
    value: 'production',
    label: '生产环境',
    branchName: 'master'
  }
]

export const originalTasksTypes = [
  {
    value: 'Update',
    label: '配置更新',
    params: [{ name: 'jobName', required: true }]
  },
  {
    value: 'Publish',
    label: '发布',
    params: [
      { name: 'projectName', required: true },
      { name: 'environment', required: true }
    ]
  },
  {
    value: 'Establish',
    label: '构建',
    params: [{ name: 'jobName', required: true }]
  },
  {
    value: 'ParametricBuild',
    label: '参数化构建',
    params: [
      { name: 'jobName', required: true },
      { name: 'environment', required: true }
    ]
  },
  {
    value: 'Notify',
    label: '通知',
    params: [
      { name: 'name', required: true },
      { name: 'jobName', required: true },
      { name: 'environment', required: true },
      { name: 'updatedContent', required: false }
    ]
  },
  {
    value: 'Deploy',
    label: '部署',
    params: []
  }
]

const customTasksQueue = []

const tasks = {
  runUpdateTask: async () => {
    console.log('update')
    // TODO 更新工作流
    return Promise.resolve('ok')
  },
  runPublishTask: async ({ projectName, environment }) => {
    if (!projectName || !environment) {
      return Promise.reject(new Error('参数不能为空'))
    }

    console.log('publish')
    try {
      const { data } = await getProjectId(projectName)
      console.log(data)

      if (data.length !== 1) {
        return Promise.reject(new Error('请填写正确的项目仓库名'))
      }

      const { id } = data[0]
      const includedType = originalEnvTypes.find(
        item => item.value === environment
      )
      const index = originalEnvTypes.indexOf(includedType)
      // 当前分支
      const currentBranch = includedType ? includedType.branchName : 'test'
      // 合并分支
      const nextBranch = originalEnvTypes[index + 1]
        ? originalEnvTypes[index + 1].branchName
        : 'master'
      console.log(index, currentBranch, nextBranch)

      const mergeRequestListRes = await listMergeRequests(id, {})
      const repeatedMergeRequest = mergeRequestListRes.data.find(
        item =>
          item.source_branch === currentBranch &&
          item.target_branch === nextBranch &&
          item.title.includes('Publisher 自动合并请求')
      )

      const res = await compareBranches(id, {
        from: nextBranch,
        to: currentBranch
      })
      console.log(
        `当前环境分支<${currentBranch}>共有${res.data.commits.length}次提交未合并到<${nextBranch}>`
      )
      // TODO 总线通讯开启确认弹窗

      if (repeatedMergeRequest) {
        await deleteMergeRequest(id, repeatedMergeRequest.id)
      }

      if (currentBranch !== nextBranch) {
        await createsNewMergeRequest(id, {
          sourceBranch: currentBranch,
          targetBranch: nextBranch,
          title: `Publisher 自动合并请求 [${nanoid()}]`,
          description: res.data.commits.reduce((acc, cur) => {
            // markdown
            return acc.concat(`## ${cur.message}\n\n------\n\n`)
          }, '')
        })
      }

      // TODO 自动合并
    } catch (err) {
      console.log(err)
      showNotification({
        title: '自动发布异常通知',
        body: `Gitlab 项目 ${projectName} 自动发布异常，请检查`
      })
      return Promise.reject(err)
    }

    return Promise.resolve('ok')
  },
  runEstablishTask: async ({ jobName }) => {
    if (!jobName) return Promise.reject(new Error('参数 jobName 不能为空'))

    console.log('establish')
    try {
      await build(jobName)
    } catch (err) {
      console.error(err)
      showNotification({
        title: '构建异常通知',
        body: `工作任务 ${jobName} 构建请求异常，请检查`
      })
      return Promise.reject(err)
    }
    showNotification({
      title: '前端构建通知',
      body: `工作任务 ${jobName} 发起构建请求`
    })
    return Promise.resolve('ok')
  },
  runParametricBuildTask: async ({ jobName, environment }) => {
    if (!jobName || !environment) {
      return Promise.reject(new Error('参数不能为空'))
    }

    if (!originalEnvTypes.some(item => item.value === environment)) {
      return Promise.reject(new Error('environment 参数不合法'))
    }

    console.log('parametric build')
    const params = [
      { HOSTNAME: 'development', SCRIPT: 'build:dev', BRANCH: 'test' },
      { HOSTNAME: 'preview', SCRIPT: 'build:pre', BRANCH: 'dev' },
      { HOSTNAME: 'production', SCRIPT: 'build:prod', BRANCH: 'master' }
    ]

    const preload = params.filter(item => item.HOSTNAME === environment)[0]

    try {
      await buildWithParams(jobName, preload)
    } catch (err) {
      console.error(err)
      showNotification({
        title: '参数化构建异常通知',
        body: `工作任务 ${jobName} 参数化构建请求异常，请检查`
      })
      return Promise.reject(err)
    }
    showNotification({
      title: '前端参数化构建通知',
      body: `工作任务 ${jobName} 发起参数化构建请求`
    })
    return Promise.resolve('ok')
  },
  runNotifyTask: async ({ name, jobName, environment, updatedContent }) => {
    if (!name || !jobName || !environment) {
      return Promise.reject(new Error('除更新内容外其他参数不能为空'))
    }

    if (!originalEnvTypes.some(item => item.value === environment)) {
      return Promise.reject(new Error('environment 参数不合法'))
    }

    const includedType = originalEnvTypes.find(
      item => item.value === environment
    )

    console.log('notify')
    // TODO 修改“生产环境”
    try {
      await sendWechatNotification({
        name,
        jobName,
        environment: includedType.label,
        updatedContent,
        onlyDeveloper: environment !== 'production'
      })

      await sendEmailNotification({
        name,
        jobName,
        environment: includedType.label,
        updatedContent
      })
    } catch (err) {
      console.error(err)
      showNotification({
        title: '通知发送异常通知',
        body: `项目 ${name} 通知发送异常，请检查`
      })
      return Promise.reject(err)
    }
    return Promise.resolve('ok')
  },
  runDeployTask: async () => {
    console.log('deploy')
    // TODO 部署工作流
    return Promise.resolve('ok')
  }
}

// 判断是否为合法任务
export const isLegalTask = task => {
  const tempList = originalTasksTypes.filter(item => item.value === task.action)
  return tempList && tempList.length === 1
}

// 任务队列去除空值（ 例如：{} ）
export const tasksQueueTrim = tasksQueue => {
  return tasksQueue.filter(item => Object.getOwnPropertyNames(item).length > 0)
}

// 添加自定义任务
export const addCustomTask = fn => {
  if (fn) {
    customTasksQueue.push(fn)
  }
}

// 执行任务工作流
export const runWorkflow = async workflow => {
  const tasksQueue = workflow.map(task => {
    const isExist = isLegalTask(task)

    return isExist
      ? { task: tasks[`run${task.action}Task`], params: task.params }
      : {}
  })

  const finalTasksQueue = tasksQueueTrim(tasksQueue)

  // TODO 插入规则待改进
  customTasksQueue && finalTasksQueue.push(...customTasksQueue)

  // TODO 任务队列去重
  console.log(finalTasksQueue)

  // TODO 总线通讯调起全局变量输入弹窗

  return Promise.allSettled(
    finalTasksQueue.map(item => {
      try {
        return typeof item.task === 'function'
          ? item.task(item.params)
          : item.task
      } catch (e) {
        return Promise.reject(e)
      }
    })
  )
}

// 执行单一任务
export const runOneTask = async ({ action, params }) => {
  const isExist = isLegalTask({ action, params })
  if (!isExist) return Promise.reject(new Error('不是合法的任务'))

  const oneTask = [{ task: tasks[`run${action}Task`], params }]

  console.log(oneTask)

  // TODO 格式暂时与队列保持一致
  return Promise.allSettled(
    oneTask.map(item => {
      try {
        return typeof item.task === 'function'
          ? item.task(item.params)
          : item.task
      } catch (e) {
        return Promise.reject(e)
      }
    })
  )
}
