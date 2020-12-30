/*
 * @Author: Whzcorcd
 * @Date: 2020-12-24 16:35:50
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-30 16:33:00
 * @Description: file content
 */
import { nanoid } from 'nanoid'
import { showNotification } from '@/app/notification'
import { originalEnvTypes } from '@/modules/task/types'
import {
  getProject,
  compareBranches,
  listMergeRequests,
  deleteMergeRequest,
  createsNewMergeRequest
} from '@/plugins/gitlab'

export const PublishTask = async ({ projectName, environment }) => {
  if (!projectName || !environment) {
    return Promise.reject(new Error('参数不能为空'))
  }

  console.log('publish')
  try {
    const { data } = await getProject(projectName)
    console.log(data)

    if (data.length !== 1) {
      return Promise.reject(new Error('请填写正确的项目仓库名'))
    }

    const { id } = data[0]
    const includedType = originalEnvTypes.find(
      item => item.value === environment
    )
    const index = originalEnvTypes.indexOf(includedType)
    // 当前分支
    const currentBranch = includedType ? includedType.branchName : 'test'
    // 合并分支
    const nextBranch = originalEnvTypes[index + 1]
      ? originalEnvTypes[index + 1].branchName
      : 'master'
    console.log(index, currentBranch, nextBranch)

    const mergeRequestListRes = await listMergeRequests(id, {})
    const repeatedMergeRequest = mergeRequestListRes.data.find(
      item =>
        item.source_branch === currentBranch &&
        item.target_branch === nextBranch &&
        item.title.includes('Publisher 自动合并请求')
    )

    const res = await compareBranches(id, {
      from: nextBranch,
      to: currentBranch
    })
    console.log(
      `当前环境分支<${currentBranch}>共有${res.data.commits.length}次提交未合并到<${nextBranch}>`
    )
    // TODO 总线通讯开启确认弹窗

    if (repeatedMergeRequest) {
      await deleteMergeRequest(id, repeatedMergeRequest.id)
    }

    if (currentBranch !== nextBranch) {
      await createsNewMergeRequest(id, {
        sourceBranch: currentBranch,
        targetBranch: nextBranch,
        title: `Publisher 自动合并请求 [${nanoid()}]`,
        description: res.data.commits.reduce((acc, cur) => {
          // markdown
          return acc.concat(`## ${cur.message}\n\n------\n\n`)
        }, '')
      })
    }

    // TODO 自动合并
  } catch (err) {
    console.log(err)
    showNotification({
      title: '自动发布异常通知',
      body: `Gitlab 项目 ${projectName} 自动发布异常，请检查`
    })
    return Promise.reject(err)
  }

  return Promise.resolve('ok')
}
