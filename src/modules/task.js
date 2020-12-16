/*
 * @Author: Whzcorcd
 * @Date: 2020-12-06 22:06:34
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-16 16:54:49
 * @Description: file content
 */
import { showNotification } from '*/notification'
import { build } from '@/plugins/jenkins'
import { sendWechatNotification, sendEmailNotification } from '@/plugins/notify'

// TODO 工作流原始配置统一
// const originalTasksType = ['Update', 'Publish', 'Establish', 'Notify', 'Deploy']

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
  runNotifyTask: async ({ name, jobName, environment, updatedContent }) => {
    if (!name || !jobName || !environment) {
      return Promise.reject(new Error('除更新内容外其他参数不能为空'))
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

export const addCustomTask = fn => {
  if (fn) {
    customTasksQueue.push(fn)
  }
}

export const runWorkflow = async workflow => {
  const tasksQueue = workflow.map(task => {
    return { task: tasks[`run${task.action}Task`], params: task.params }
  })

  // TODO 插入规则待改进
  customTasksQueue && tasksQueue.push(...customTasksQueue)

  console.log(tasksQueue)

  return Promise.allSettled(
    tasksQueue.map(item => {
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

export const runOneItem = async ({ action, params }) => {
  const oneTask = [{ task: tasks[`run${action}Task`], params }]

  console.log(oneTask)

  // TODO 格式暂时保持一致
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
