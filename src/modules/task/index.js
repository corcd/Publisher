/*
 * @Author: Whzcorcd
 * @Date: 2020-12-06 22:06:34
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-07-14 17:07:58
 * @Description: file content
 */
import store from '@/store'
import { showNotification } from '@/app/notification'
import { originalTasksTypes } from './types'

import {
  StaticScanTask,
  UpdateTask,
  PublishTask,
  EstablishTask,
  ParametricBuildTask,
  PackImagesTask,
  NotifyTask,
  DeployTask
} from './modules'

const customTasksQueue = []

const tasks = {
  runStaticScanTask: StaticScanTask,
  runUpdateTask: UpdateTask,
  runPublishTask: PublishTask,
  runEstablishTask: EstablishTask,
  runParametricBuildTask: ParametricBuildTask,
  runPackImagesTask: PackImagesTask,
  runNotifyTask: NotifyTask,
  runDeployTask: DeployTask
}

// 任务队列去除空值（ 例如：{} ）
const tasksQueueTrim = tasksQueue => {
  return tasksQueue.filter(item => Object.getOwnPropertyNames(item).length > 0)
}

// 判断是否为合法任务
export const isLegalTask = task => {
  const tempList = originalTasksTypes.filter(item => item.value === task.action)
  return tempList && tempList.length === 1
}

// 添加自定义任务
export const addCustomTask = fn => {
  if (fn) {
    customTasksQueue.push(fn)
  }
}

// 任务队列顺序执行器
const tasksQueueExecutor = async queue => {
  // const id = powerSaveBlocker.start('prevent-display-sleep')

  let index = 0
  while (index >= 0 && index < queue.length) {
    const item = queue[index]

    if (typeof item.task !== 'function') {
      throw new Error('task is not a function')
    }
    // eslint-disable-next-line no-await-in-loop
    await item.task(item.params).catch(err => {
      console.error(err)
      throw err
    })
    index++
  }

  // powerSaveBlocker.isStarted(id) && powerSaveBlocker.stop(id)
}

// 执行单一任务
export const runOneTask = async ({ id, action, params }) => {
  const isExist = isLegalTask({ action, params })
  if (!isExist) return Promise.reject(new Error('不是合法的任务'))

  const finalParams = Object.assign({}, params, { id })
  const oneTask = [{ task: tasks[`run${action}Task`], params: finalParams }]

  store.dispatch('task/addOngoingTasks', { id })
  try {
    await tasksQueueExecutor(oneTask)
    store.dispatch('task/addCompletedTasks', { id })
    showNotification({
      title: '工作流通知',
      body: `工作流<${id}>单任务${action}已完成`
    })
  } catch (err) {
    console.error(err)
    store.dispatch('task/addFailedTasks', { id, err })
    showNotification({
      title: '工作流通知',
      body: `工作流<${id}>单任务${action}执行发生错误，已中止`
    })
    return Promise.reject(new Error(err))
  }
  return Promise.resolve()
}

// 重构的执行任务工作流，支持全局状态
export const runWorkflowRefactored = async (
  id,
  workflow,
  globalParams = {}
) => {
  const tasksQueue = workflow.map(task => {
    const isExist = isLegalTask(task)
    const params = JSON.parse(JSON.stringify(task.params))

    return isExist
      ? {
          task: tasks[`run${task.action}Task`],
          params: Object.assign({}, params, globalParams, { id })
        }
      : {}
  })

  const finalTasksQueue = tasksQueueTrim(tasksQueue)

  // TODO 插入规则待改进
  customTasksQueue && finalTasksQueue.push(...customTasksQueue)

  store.dispatch('task/addOngoingTasks', { id })
  try {
    await tasksQueueExecutor(finalTasksQueue)
    store.dispatch('task/addCompletedTasks', { id })
    showNotification({
      title: '工作流通知',
      body: `工作流<${id}>已全部完成`
    })
  } catch (err) {
    console.error(err)
    store.dispatch('task/addFailedTasks', { id, err })
    showNotification({
      title: '工作流通知',
      body: `工作流<${id}>执行发生错误，已中止`
    })
    return Promise.reject(new Error(err))
  }
  return Promise.resolve()
}
