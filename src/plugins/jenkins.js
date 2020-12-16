/*
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:22:13
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-16 16:48:33
 * @Description: file content
 */
import _axios from '@/request'
import qs from 'qs'

// 11719195c806e2c85599e7f86052431a95
const authorization = {
  username: 'bot',
  password: 'whz18267590821'
}

const baseUrl = 'http://47.99.79.15:8081/job'

const request = (jobName, actionUrl, method, params = {}) => {
  return method === 'POST'
    ? _axios({
        method,
        url: `${baseUrl}/${jobName}/${actionUrl}`,
        headers: {
          Authorization: `Basic ${window.btoa(
            `${authorization.username}:${authorization.password}`
          )}`,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' // 指定提交方式为表单提交
        },
        data: params ? qs.stringify(params) : {}
      })
    : _axios({
        method,
        url: `${baseUrl}/${jobName}/${actionUrl}`,
        headers: {
          Authorization: `Basic ${window.btoa(
            `${authorization.username}:${authorization.password}`
          )}`,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' // 指定提交方式为表单提交
        }
      })
}

export const getJobInfo = jobName => {
  return request(jobName, 'api/json', 'GET')
}

export const getBuildInfo = (jobName, buildNumber) => {
  return request(jobName, `${buildNumber}/api/json`, 'GET')
}

export const console = jobName => {
  return request(jobName, 'lastBuild/logText/progressiveText', 'GET')
}

export const getLastBuildNumber = jobName => {
  return request(jobName, 'lastBuild/buildNumber', 'GET')
}

export const build = jobName => {
  return request(jobName, 'build', 'POST')
}

// TODO 合并所有 jenkins 相关操作
