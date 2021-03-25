/*
 * @Author: Whzcorcd
 * @Date: 2020-12-24 16:34:28
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-03-25 15:04:29
 * @Description: file content
 */
export const originalEnvTypes = [
  {
    value: 'development',
    label: '测试环境',
    branchName: 'test',
    webhook: [
      'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=afaa2567-4ad4-4aa4-93ba-44df4a776242'
    ]
  },
  {
    value: 'preview',
    label: '预发环境',
    branchName: 'dev',
    webhook: [
      'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=342b0cee-0e35-4067-939a-82acc4c38031'
    ]
  },
  {
    value: 'production',
    label: '生产环境',
    branchName: 'master',
    webhook: [
      'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=342b0cee-0e35-4067-939a-82acc4c38031'
    ]
  }
]

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
      { name: 'environment', required: true, prefixed: true }
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
      { name: 'updatedContent', required: false, prefixed: true }
    ]
  },
  {
    value: 'Deploy',
    label: '容器部署',
    params: []
  }
]
