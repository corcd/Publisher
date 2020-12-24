/*
 * @Author: Whzcorcd
 * @Date: 2020-12-06 22:06:34
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-25 02:04:02
 * @Description: file content
 */
import { originalTasksTypes } from './types'

import {
  UpdateTask,
  PublishTask,
  EstablishTask,
  ParametricBuildTask,
  NotifyTask,
  DeployTask
} from './modules'

const customTasksQueue = []

const tasks = {
  runUpdateTask: UpdateTask,
  runPublishTask: PublishTask,
  runEstablishTask: EstablishTask,
  runParametricBuildTask: ParametricBuildTask,
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

// 执行任务工作流
export const runWorkflow = async (workflow, globalParams = {}) => {
  // TODO 更新全局参数至各模块
  const tasksQueue = workflow.map(task => {
    const isExist = isLegalTask(task)

    return isExist
      ? {
          task: tasks[`run${task.action}Task`],
          params: Object.assign(task.params, globalParams)
        }
      : {}
  })

  const finalTasksQueue = tasksQueueTrim(tasksQueue)

  // TODO 插入规则待改进
  customTasksQueue && finalTasksQueue.push(...customTasksQueue)

  // TODO 任务队列去重
  console.log(finalTasksQueue)

  // TODO 总线通讯调起全局变量输入弹窗

  return Promise.all(
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
  return Promise.all(
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
