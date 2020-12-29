/*
 * @Author: Whzcorcd
 * @Date: 2020-12-26 17:57:55
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-28 09:18:55
 * @Description: file content
 */
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import datastore from '#/datastore'
import { originalTasksTypes } from '@/modules/task/types'

export const resetDataBase = () => {
  return datastore.set('records', [])
}

export const getMail = () => {
  return datastore.get('mail')
}

export const setMailAuth = ({ user, pass }) => {
  datastore.assign('mail.auth', { user, pass })
}

export const setMailAddressee = ({ addressee }) => {
  datastore.set('mail.addressee', addressee)
}

export const getUser = () => {
  return datastore.get('user')
}

export const setUser = ({ name, contact, workmail }) => {
  datastore.set('user.name', name)
  datastore.set('user.contact', contact)
  datastore.set('user.workmail', workmail)
}

export const clearUser = () => {
  datastore.set('user.name', '')
  datastore.set('user.contact', '')
  datastore.set('user.workmail', '')
}

export const getRecords = () => {
  return datastore.get('records')
}

export const getOneRecord = id => {
  return datastore.getById('records', id)
}

export const addRecord = ({ attribute, buildInfo, projectInfo }) => {
  if (!attribute.name || !attribute.projectName || !attribute.jobName) {
    console.error('任一参数均不能为空')
    return
  }

  datastore.push('records', {
    id: nanoid(),
    attribute,
    buildInfo,
    projectInfo,
    workflow: [],
    attackTime: 0,
    updateTime: dayjs().unix()
  })
}

export const updateRecordAttackTime = ({ id }) => {
  datastore.setById('records', id, 'attackTime', dayjs().unix())
}

export const delRecord = ({ id }) => {
  if (!id) {
    console.error('参数不能为空')
    return
  }

  datastore.deleteById('records', id)
}

export const unshiftWorkflow = ({ id, newAction, params = {} }) => {
  datastore.unshiftById('records', id, 'workflow', {
    action: newAction,
    params
  })
}

export const insertWorkflow = ({
  id,
  currentAction,
  newAction,
  params = {}
}) => {
  const workflow = getOneRecord(id).workflow

  // 当前 action 的数组下标
  const index = workflow.indexOf(
    workflow.find(item => item.action === currentAction)
  )

  workflow.splice(index + 1, 0, {
    action: newAction,
    params
  })

  datastore.setById('records', id, 'workflow', workflow)
}

export const updateWorkflowParams = ({ id, action, newParams }) => {
  datastore.updateDeepById(
    'records',
    id,
    'workflow',
    action,
    'params',
    newParams
  )
}

export const updateAllWorkflowParams = ({ id, globalParams }) => {
  const { workflow } = getOneRecord(id)
  const keyValues = Object.entries(globalParams)
  console.log('keyValues', keyValues)

  workflow.forEach(({ action }) => {
    const exceptParams = originalTasksTypes.find(task => task.value === action)
      .params
    console.log('exceptParams', exceptParams)
    if (exceptParams.length === 0) return

    exceptParams.forEach(param => {
      const matchedItem = keyValues.find(item => item[0] === param.name)

      if (matchedItem) {
        console.log('update params', param.name)

        datastore.updateDeepById(
          'records',
          id,
          'workflow',
          { action },
          `params.${param.name}`,
          matchedItem[1]
        )
      }
    })
  })
}

export const deleteWorkflowItem = ({ id, action }) => {
  datastore.removeById('records', id, 'workflow', n => {
    return n.action === action
  })
}
