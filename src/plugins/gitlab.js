/*
 * @Author: Whzcorcd
 * @Date: 2020-12-19 13:56:16
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-23 14:21:48
 * @Description: file content
 */
import _axios from '@/request'
import { gitlab } from '@/config'
import qs from 'qs'

const { baseUrl, private_token } = gitlab

const request = (restfulUrl, method, params = {}) => {
  return _axios({
    method,
    url: `${baseUrl}${restfulUrl}`,
    headers: {
      'PRIVATE-TOKEN': private_token,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' // 指定提交方式为表单提交
    },
    data: method === 'GET' ? params : qs.stringify(params)
  })
}

// 获取项目 id
export const getProjectId = projectName => {
  return request(`/projects`, 'GET', {
    search: projectName
  })
}

// 获取仓库所有分支
export const listRepositoryBranches = id => {
  return request(`/projects/${id}/repository/branches`, 'GET')
}

// 比较分支
export const compareBranches = (id, { from, to }) => {
  return request(`/projects/${id}/repository/compare`, 'GET', { from, to })
}

// 获取仓库文件目录树
export const listRepositoryTree = id => {
  return request(`/projects/${id}/repository/tree`, 'GET')
}

// 获取项目仓库 Tags
export const listProjectRepositoryTags = id => {
  return request(`/projects/${id}/repository/tags`, 'GET')
}

// 创建新 Tag
export const createNewTag = (id, { tagName, ref, releaseDescription }) => {
  return request(`/projects/${id}/repository/tags`, 'POST', {
    tag_name: tagName,
    ref,
    release_description: releaseDescription
  })
}

// 创建新的 release
export const createNewRelease = (id, tagName, { description }) => {
  return request(`/projects/${id}/repository/tags/${tagName}/release`, 'POST', {
    description
  })
}

// 获取单次提交信息
export const getSingleCommit = (id, sha) => {
  return request(`/projects/${id}/repository/commits/${sha}`, 'GET')
}

// 获取所有合并记录
export const listMergeRequests = (id, { state = 'opened' }) => {
  return request(`/projects/${id}/merge_requests`, 'GET', { state })
}

// 获取合并提交记录
export const getSingleMergeRequestCommits = (id, mergeRequestId) => {
  return request(
    `/projects/${id}/merge_requests/${mergeRequestId}/commits`,
    'GET'
  )
}

// 发起合并请求
export const createsNewMergeRequest = (
  id,
  {
    sourceBranch,
    targetBranch,
    // assigneeId,
    title,
    description
  }
) => {
  return request(`/projects/${id}/merge_requests`, 'POST', {
    source_branch: sourceBranch,
    target_branch: targetBranch,
    // assigneeId,
    title,
    description
  })
}

// 移除合并请求
export const deleteMergeRequest = (id, mergeRequestId) => {
  return request(`/projects/${id}/merge_requests/${mergeRequestId}`, 'DELETE')
}

// 接受合并请求
export const acceptMergeRequest = (
  id,
  mergeRequestId,
  {
    source_branch: sourceBranch,
    target_branch: targetBranch,
    // assigneeId,
    title,
    description
  }
) => {
  return request(
    `/projects/${id}/merge_requests/${mergeRequestId}/merge`,
    'PUT',
    {
      sourceBranch,
      targetBranch,
      // assigneeId,
      title,
      description
    }
  )
}
