/*
 * @Author: Whzcorcd
 * @Date: 2021-01-09 15:30:23
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-09 15:46:51
 * @Description: file content
 */
import { encode } from 'js-base64'
import qs from 'qs'
import _axios from '@/request'
import { sonarqube } from '@/config'

const {
  server,
  authorization: { username, password }
} = sonarqube

const request = (url, method = 'GET', params = {}) => {
  return _axios({
    method,
    url: `${server}/api${url}`,
    headers: {
      Authorization: `Basic ${encode(`${username}:${password}`)}`,
      'Content-Type': 'application/json; charset=UTF-8'
    },
    data: method === 'GET' ? params : qs.stringify(params)
  })
}

// 获取项目扫描报告
export const getProjectQualityGates = projectName => {
  return request('/qualitygates/project_status', 'GET', {
    projectKey: projectName
  })
}
