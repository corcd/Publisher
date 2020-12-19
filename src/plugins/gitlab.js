/*
 * @Author: Whzcorcd
 * @Date: 2020-12-19 13:56:16
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-19 14:33:36
 * @Description: file content
 */
import _axios from '@/request'
import { gitlab } from '@/config'
import qs from 'qs'

const { baseUrl, private_token } = gitlab

const request = (restfulUrl, method, params = {}) => {
  return method === 'POST'
    ? _axios({
        method,
        url: `${baseUrl}/${restfulUrl}`,
        headers: {
          'PRIVATE-TOKEN': private_token,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' // 指定提交方式为表单提交
        },
        data: params ? qs.stringify(params) : {}
      })
    : _axios({
        method,
        url: `${baseUrl}/${restfulUrl}`,
        headers: {
          'PRIVATE-TOKEN': private_token,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' // 指定提交方式为表单提交
        }
      })
}

export const listRepositoryTree = id => {
  return request(`/projects/${id}/repository/tree`, 'GET')
}
