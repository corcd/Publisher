/*
 * @Author: Whzcorcd
 * @Date: 2020-12-06 22:06:34
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-19 14:24:26
 * @Description: file content
 */
import { showNotification } from '*/notification'
import { listRepositoryTree } from '@/plugins/gitlab'
import { build, buildWithParams } from '@/plugins/jenkins'
import { sendWechatNotification, sendEmailNotification } from '@/plugins/notify'

export const originalEnvTypes = [
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
    params: [{ name: 'id', required: true }]
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
  runPublishTask: async () => {
    console.log('publish')
    // TODO 发布工作流
    await listRepositoryTree(72)
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
      { hostname: 'development', script: 'build:dev', branch: 'test' },
      { hostname: 'preview', script: 'build:pre', branch: 'dev' },
      { hostname: 'production', script: 'build:prod', branch: 'master' }
    ]

    const preload = params.filter(item => item.hostname === environment)[0]

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

    console.log('notify')
    await sendWechatNotification({
      name,
      jobName,
      environment,
      updatedContent,
      onlyDeveloper: environment !== 'production'
    })

    await sendEmailNotification({
      name,
      jobName,
      environment,
      updatedContent
    })
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
