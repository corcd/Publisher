/*
 * @Author: Whzcorcd
 * @Date: 2021-01-09 09:45:57
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-09 15:55:42
 * @Description: file content
 */
import { app, remote } from 'electron'
import download from 'download-git-repo'
import rimraf from 'rimraf'
import path from 'path'
import { scan } from '#/plugins/sonarqube'
import { getOneRecord } from '#/plugins/data'
import { gitlab } from '@/config'
import { getProjectQualityGates } from '@/plugins/sonarqube'

const isDevelopment = process.env.NODE_ENV !== 'production'
const APP = process.type === 'renderer' ? remote.app : app

const SCAN_FILES_PATH = APP.getPath('userData')

const {
  host,
  authorization: { username, password }
} = gitlab

const downloadRepo = (url, tmpPath) => {
  return new Promise((resolve, reject) => {
    download(url, tmpPath, { clone: true }, err => {
      if (err) return reject(err)
      return resolve()
    })
  })
}

export const StaticScanTask = async ({ id, projectName, environment }) => {
  console.log('static scan')

  // TODO 参数来源需更改
  const params = [
    { HOSTNAME: 'development', SCRIPT: 'build:dev', BRANCH: 'test' },
    { HOSTNAME: 'preview', SCRIPT: 'build:pre', BRANCH: 'dev' },
    { HOSTNAME: 'production', SCRIPT: 'build:prod', BRANCH: 'master' }
  ]
  const {
    projectInfo: { url }
  } = getOneRecord(id)

  const branch = params.find(item => item.HOSTNAME === environment)['BRANCH']
  const repoInfo = url.split(host)
  const downloadUrl = `direct:${repoInfo[0]}${username}:${password}@${host}${repoInfo[1]}.git#${branch}`
  const tmpPath = isDevelopment ? 'tmp' : path.join(SCAN_FILES_PATH, 'tmp')

  try {
    await downloadRepo(downloadUrl, tmpPath)
    await scan(projectName, tmpPath)
  } catch (err) {
    console.error(err)
    return Promise.reject(new Error('项目静态扫描失败，请检查项目是否存在'))
  }

  rimraf(tmpPath, err => {
    if (err) {
      console.error(err)
      return Promise.reject(err)
    }
  })

  try {
    const { data } = await getProjectQualityGates(projectName)
    if (data.projectStatus.status !== 'OK') {
      return Promise.reject(new Error('项目静态扫描未通过'))
    }
  } catch (err) {
    console.error(err)
    return Promise.reject(new Error('项目静态扫描报告获取失败'))
  }

  return Promise.resolve('ok')
}
