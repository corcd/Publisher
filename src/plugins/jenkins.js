/*
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:22:13
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-24 17:40:26
 * @Description: file content
 */
import _axios from '@/request'
import { jenkins } from '@/config'
import qs from 'qs'

const { baseUrl, authorization } = jenkins

const request = (jobName, actionUrl, method, params = {}) => {
  return _axios({
    method,
    url: `${baseUrl}/${jobName}/${actionUrl}`,
    headers: {
      Authorization: `Basic ${window.btoa(
        `${authorization.username}:${authorization.password}`
      )}`,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' // 指定提交方式为表单提交
    },
    data: method === 'POST' ? qs.stringify(params) : params
  })
}

// 获取任务详情
export const getJobInfo = jobName => {
  return request(jobName, 'api/json', 'GET')
}

// 获取构建详情
export const getBuildInfo = (jobName, buildNumber) => {
  return request(jobName, `${buildNumber}/api/json`, 'GET')
}

// 获取控制台输出
export const console = jobName => {
  return request(jobName, 'lastBuild/logText/progressiveText', 'GET')
}

// 获取最后一次构建数据
export const getLastBuildNumber = jobName => {
  return request(jobName, 'lastBuild/buildNumber', 'GET')
}

// 获取最后一次构建时间戳
export const getBuildTimestamp = jobName => {
  return request(jobName, 'lastBuild/buildTimestamp', 'GET')
}

// 任务普通构建
export const build = jobName => {
  return request(jobName, 'build', 'POST')
}

// 任务参数化构建
export const buildWithParams = (jobName, preload) => {
  return request(jobName, 'buildWithParameters', 'POST', preload)
}

// TODO 合并所有 jenkins 相关操作
