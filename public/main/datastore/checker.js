/*
 * @Author: Whzcorcd
 * @Date: 2020-12-26 17:34:57
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-26 18:03:16
 * @Description: file content
 */
import { app, remote } from 'electron'
import fs from 'fs-extra'
import path from 'path'
import dayjs from 'dayjs'
import { showNotification } from '@/app/notification'
import { defaultData } from './default'

const isRendererProcess = process.type === 'renderer'
const APP = process.type === 'renderer' ? remote.app : app

const STORE_PATH = APP.getPath('userData')

const errorMsg = {
  broken: 'Publisher 配置文件损坏，已经恢复为默认配置',
  brokenButBackup: 'Publisher 配置文件损坏，已经恢复为备份配置'
}

export const checker = () => {
  if (!isRendererProcess) {
    const configFilePath = path.join(STORE_PATH, 'data.json')
    const configFileBackupPath = path.join(STORE_PATH, 'data.bak.json')

    if (!fs.existsSync(configFilePath)) {
      return
    }

    let configFile = ''
    const optionsTemplate = {
      title: '注意',
      body: ''
    }

    try {
      configFile = fs.readFileSync(configFilePath, { encoding: 'utf-8' })
      // 判断是否为合法的 json 文件
      JSON.parse(configFile)
    } catch (err) {
      fs.unlinkSync(configFilePath)

      if (fs.existsSync(configFileBackupPath)) {
        // 有备份
        try {
          configFile = fs.readFileSync(configFileBackupPath, {
            encoding: 'utf-8'
          })
          // 判断是否为合法的 json 文件
          JSON.parse(configFile)

          fs.writeFileSync(configFilePath, configFile, { encoding: 'utf-8' })

          const stats = fs.statSync(configFileBackupPath)
          Object.assign(optionsTemplate, {
            body: `${errorMsg.brokenButBackup}\n备份文件版本：${dayjs(
              stats.mtime
            ).format('YYYY-MM-DD HH:mm:ss')}`
          })
        } catch (e) {
          console.error(e)
          Object.assign(optionsTemplate, {
            body: errorMsg.configFileBackupPath
          })
        }
        showNotification(optionsTemplate)
        return
      }
      // 无备份
      fs.writeFileSync(configFilePath, defaultData, { encoding: 'utf-8' })

      Object.assign(optionsTemplate, { body: errorMsg.broken })
      showNotification(optionsTemplate)
      return
    }
    // 数据文件无异常时进行备份
    fs.writeFileSync(configFileBackupPath, configFile, { encoding: 'utf-8' })
  }
}
