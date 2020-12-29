/*
 * @Author: Whzcorcd
 * @Date: 2020-12-26 17:07:29
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-26 21:34:19
 * @Description: file content
 */
import { app, remote } from 'electron'
import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { checker } from './checker'
import { defaultData } from './default'

const isDevelopment = process.env.NODE_ENV !== 'production'
const isRendererProcess = process.type === 'renderer'
const APP = process.type === 'renderer' ? remote.app : app

const STORE_PATH = APP.getPath('userData')
const FILE_NAME = 'db.json'
const FILE = isDevelopment ? FILE_NAME : path.join(STORE_PATH, FILE_NAME)

if (!isRendererProcess) {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

checker()

class DataBase {
  db

  constructor() {
    const adapter = new FileSync(FILE)
    this.db = lowdb(adapter)
    this.db.defaults(defaultData).write()
  }

  read() {
    return this.db.read()
  }

  get(key = '') {
    return this.read()
      .get(key)
      .value()
  }

  set(key, value) {
    return this.read()
      .set(key, value)
      .write()
  }

  setById(key, id, subKey, value) {
    return this.read()
      .get(key)
      .find({ id })
      .set(subKey, value)
      .write()
  }

  has(key) {
    return this.read()
      .has(key)
      .value()
  }

  unshiftById(key, id, subKey, value) {
    return this.read()
      .get(key)
      .find({ id })
      .get(subKey)
      .unshift(value)
      .write()
  }

  removeById(key, id, subKey, remover) {
    return this.read()
      .get(key)
      .find({ id })
      .get(subKey)
      .remove(remover)
      .write()
  }

  push(key, value) {
    return this.read()
      .get(key)
      .push(value)
      .write()
  }

  pushById(key, id, subKey, value) {
    return this.read()
      .get(key)
      .find({ id })
      .get(subKey)
      .push(value)
      .write()
  }

  assign(key, value) {
    return this.read()
      .get(key)
      .assign(value)
      .write()
  }

  assignById(key, id, subKey, value) {
    return this.read()
      .get(key)
      .find({ id })
      .get(subKey)
      .assign(value)
      .write()
  }

  insert(key, value) {
    return this.read()
      .get(key)
      .insert(value)
      .write()
  }

  unset(key) {
    return this.read()
      .unset(key)
      .write()
  }

  getById(key, id) {
    return this.read()
      .get(key)
      .find({ id })
      .value()
  }

  deleteById(key, id) {
    return this.read()
      .get(key)
      .remove({ id })
      .write()
  }

  updateDeepById(key, id, subKey, subId, thirdKey, value) {
    return this.read()
      .get(key)
      .find({ id })
      .get(subKey)
      .find(subId)
      .set(thirdKey, value)
      .write()
  }
}

export default new DataBase()
