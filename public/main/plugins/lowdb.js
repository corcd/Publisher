/*
 * @Author: Whzcorcd
 * @Date: 2020-12-06 20:06:23
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-24 23:26:47
 * @Description: file content
 */
import { app, remote } from 'electron'
import path from 'path'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import dayjs from 'dayjs'
import shortid from 'shortid'

const isDevelopment = process.env.NODE_ENV !== 'production'
const App = process.type === 'renderer' ? remote.app : app
const dbFile = 'db.json'

// MacOS 未签名应用兼容
const file = path.resolve(App.getPath('userData'), dbFile)
// TODO 数据加密
// const adapter = new FileSync('db.json', {
//   serialize: (data) => encrypt(JSON.stringify(data))  // 加密
//   deserialize: (data) => JSON.parse(decrypt(data))  // 解密
// })
const adapter = isDevelopment ? new FileSync(dbFile) : new FileSync(file)

const db = low(adapter)

db.defaults({
  records: [],
  user: {
    name: '',
    contact: '',
    workmail: ''
  },
  mail: {
    addressee: 'guangdianyun@aodiansoft.com',
    auth: {
      user: 'wanghanze@aodiansoft.com', // 发件人
      pass: '4TdSaT7doqovs7dn' // 授权码
    }
  }
}).write()

export const getUser = db.get('user').value()

export const getRecords = db.get('records').value()

export const getMail = db.get('mail').value()

export const getOneRecord = id => {
  return db
    .get('records')
    .find({ id })
    .value()
}

export const setUser = ({ name, contact, workmail }) => {
  db.set('user.name', name)
    .set('user.contact', contact)
    .set('user.workmail', workmail)
    .write()
}

export const clearUser = () => {
  db.set('user.name', '')
    .set('user.contact', '')
    .set('user.workmail', '')
    .write()
}

export const addRecord = ({
  name,
  projectName,
  jobName,
  buildInfo,
  projectInfo
}) => {
  if (!name || !projectName || !jobName) {
    return Promise.reject(new Error('任一参数均不能为空'))
  }

  db.get('records')
    .push({
      id: shortid.generate(),
      name,
      projectName,
      jobName,
      buildInfo,
      projectInfo,
      workflow: [],
      attackTime: 0,
      updateTime: dayjs().unix()
    })
    .write()

  return Promise.resolve(true)
}

export const delRecord = ({ id }) => {
  if (!id) return Promise.reject(new Error('参数不能为空'))

  db.get('records')
    .remove({ id })
    .write()

  return Promise.resolve(true)
}

export const setMailAuth = ({ user, pass }) => {
  db.unset('mail.auth.user')
    .unset('mail.auth.pass')
    .write()

  db.set('mail.auth.user', user)
    .set('mail.auth.pass', pass)
    .write()
}

export const setMailAddressee = ({ addressee }) => {
  db.unset('mail.addressee').write()

  db.set('mail.addressee', addressee).write()
}

export const unshiftWorkflow = ({ id, newAction, params = {} }) => {
  db.get('records')
    .find({ id })
    .get('workflow')
    .unshift({ action: newAction, params })
    .write()
}

export const insertWorkflow = ({
  id,
  currentAction,
  newAction,
  params = {}
}) => {
  const prevWorkflow = db
    .get('records')
    .find({ id })
    .get('workflow')
    .value()

  // 当前 action 的数组下标
  const index = prevWorkflow.indexOf(
    prevWorkflow.filter(item => item.action === currentAction)[0]
  )

  const postWorkflow = prevWorkflow.splice(index + 1, 0, {
    action: newAction,
    params
  })

  db.get('records')
    .find({ id })
    .get('workflow')
    .assign({ workflow: postWorkflow })
    .write()
}

export const updateWorkflowParams = ({ id, action, newParams }) => {
  db.get('records')
    .find({ id })
    .get('workflow')
    .find({ action })
    .unset('params')
    .write()

  db.get('records')
    .find({ id })
    .get('workflow')
    .find({ action })
    .set('params', newParams)
    .write()
}

// TODO 功能合并
export const updatePublishWorkflowParams = ({ id, environment }) => {
  const action = 'Publish'

  db.get('records')
    .find({ id })
    .get('workflow')
    .find({ action })
    .unset('params.environment')
    .write()

  db.get('records')
    .find({ id })
    .get('workflow')
    .find({ action })
    .set('params.environment', environment)
    .write()
}

export const updateNotifyWorkflowParams = ({
  id,
  environment,
  updatedContent
}) => {
  const action = 'Notify'

  db.get('records')
    .find({ id })
    .get('workflow')
    .find({ action })
    .unset('params.environment')
    .unset('params.updatedContent')
    .write()

  db.get('records')
    .find({ id })
    .get('workflow')
    .find({ action })
    .set('params.environment', environment)
    .set('params.updatedContent', updatedContent)
    .write()
}

export const updateParametricBuildWorkflowParams = ({ id, environment }) => {
  const action = 'ParametricBuild'

  db.get('records')
    .find({ id })
    .get('workflow')
    .find({ action })
    .unset('params.environment')
    .write()

  db.get('records')
    .find({ id })
    .get('workflow')
    .find({ action })
    .set('params.environment', environment)
    .write()
}

export const deleteWorkflowItem = ({ id, action }) => {
  db.get('records')
    .find({ id })
    .get('workflow')
    .remove(n => {
      return n.action === action
    })
    .write()
}
