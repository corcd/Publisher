/*
 * @Author: Whzcorcd
 * @Date: 2020-12-24 16:34:28
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-07-16 17:57:24
 * @Description: file content
 */
import { envTypes } from '@/config'

export const originalEnvTypes = envTypes

export const originalTasksTypes = [
  {
    value: 'StaticScan',
    label: '静态扫描',
    params: [
      { name: 'id', required: true },
      // { name: 'projectName', required: true },
      { name: 'environment', required: true, prefixed: true }
    ]
  },
  {
    value: 'Update',
    label: '配置更新',
    params: [{ name: 'id', required: true }]
  },
  {
    value: 'Publish',
    label: '发布',
    params: [
      // { name: 'projectName', required: true },
      { name: 'environment', required: true, prefixed: true }
    ]
  },
  {
    value: 'Establish',
    label: '通用构建',
    params: [
      // { name: 'jobName', required: true }
    ]
  },
  {
    value: 'ParametricBuild',
    label: '参数化构建',
    params: [
      // { name: 'jobName', required: true },
      { name: 'environment', required: true, prefixed: true },
      { name: 'tagName', required: false, prefixed: true },
      { name: 'extra', required: false, prefixed: true }
    ]
  },
  {
    value: 'PackImages',
    label: '镜像打包',
    params: [
      { name: 'RepoNamespace', required: true, prefixed: true },
      { name: 'RepoName', required: true, prefixed: true },
      { name: 'environment', required: true, prefixed: true }
    ]
  },
  {
    value: 'Notify',
    label: '通知',
    params: [
      // { name: 'name', required: true },
      // { name: 'jobName', required: true },
      { name: 'environment', required: true, prefixed: true },
      { name: 'updatedContent', required: false, prefixed: true },
      { name: 'mentionedList', required: false, prefixed: true }
    ]
  },
  {
    value: 'Deploy',
    label: '容器部署',
    params: []
  }
]
