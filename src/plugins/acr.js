/*
 * @Author: Whzcorcd
 * @Date: 2021-02-02 14:27:49
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-02-03 15:07:41
 * @Description: file content
 */
import { ROAClient } from '@alicloud/pop-core'
import { aliyun } from '@/config'

const { regionId, authorization } = aliyun
const { accessKeyId, accessKeySecret } = authorization

class CrClient extends ROAClient {
  constructor(config) {
    config.apiVersion = '2016-06-07'
    super(config)
  }

  cancelRepoBuild(
    repoNamespace,
    repoName,
    buildId,
    body,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/build/${buildId}/cancel`
    return super.post(path, {}, body, headers, opts)
  }

  createCollection(body, headers = {}, opts = {}) {
    const path = `/collections`
    return super.put(path, {}, body, headers, opts)
  }

  createNamespace(body, headers = {}, opts = {}) {
    const path = `/namespace`
    return super.put(path, {}, body, headers, opts)
  }

  createNamespaceAuthorization(namespace, body, headers = {}, opts = {}) {
    const path = `/namespace/${namespace}/authorizations`
    return super.put(path, {}, body, headers, opts)
  }

  createRepo(body, headers = {}, opts = {}) {
    const path = `/repos`
    return super.put(path, {}, body, headers, opts)
  }

  createRepoAuthorization(
    repoNamespace,
    repoName,
    body,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/authorizations`
    return super.put(path, {}, body, headers, opts)
  }

  createRepoBuildRule(repoNamespace, repoName, body, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/rules`
    return super.put(path, {}, body, headers, opts)
  }

  createRepoSyncTask(repoNamespace, repoName, body, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/syncTasks`
    return super.put(path, {}, body, headers, opts)
  }

  createRepoWebhook(repoNamespace, repoName, body, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/webhooks`
    return super.put(path, {}, body, headers, opts)
  }

  createUserInfo(body, headers = {}, opts = {}) {
    const path = `/users`
    return super.put(path, {}, body, headers, opts)
  }

  createUserSourceAccount(body, headers = {}, opts = {}) {
    const path = `/users/sourceAccount`
    return super.put(path, {}, body, headers, opts)
  }

  deleteCollection(collectionId, headers = {}, opts = {}) {
    const path = `/collections/${collectionId}`
    return super.delete(path, {}, headers, opts)
  }

  deleteImage(repoNamespace, repoName, tag, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/tags/${tag}`
    return super.delete(path, {}, headers, opts)
  }

  deleteNamespace(namespace, headers = {}, opts = {}) {
    const path = `/namespace/${namespace}`
    return super.delete(path, {}, headers, opts)
  }

  deleteNamespaceAuthorization(
    namespace,
    authorizeId,
    headers = {},
    opts = {}
  ) {
    const path = `/namespace/${namespace}/authorizations/${authorizeId}`
    return super.delete(path, {}, headers, opts)
  }

  deleteRepo(repoNamespace, repoName, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}`
    return super.delete(path, {}, headers, opts)
  }

  deleteRepoAuthorization(
    repoNamespace,
    repoName,
    authorizeId,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/authorizations/${authorizeId}`
    return super.delete(path, {}, headers, opts)
  }

  deleteRepoBuildRule(
    repoNamespace,
    repoName,
    buildRuleId,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/rules/${buildRuleId}`
    return super.delete(path, {}, headers, opts)
  }

  deleteRepoWebhook(
    repoNamespace,
    repoName,
    webhookId,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/webhooks/${webhookId}`
    return super.delete(path, {}, headers, opts)
  }

  deleteUserSourceAccount(sourceAccountId, headers = {}, opts = {}) {
    const path = `/users/sourceAccount/${sourceAccountId}`
    return super.delete(path, {}, headers, opts)
  }

  getAuthorizationToken(headers = {}, opts = {}) {
    const path = `/tokens`
    return super.get(path, {}, headers, opts)
  }

  getCollection(query, headers = {}, opts = {}) {
    const path = `/collections`
    return super.get(path, query, headers, opts)
  }

  getImageLayer(repoNamespace, repoName, tag, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/tags/${tag}/layers`
    return super.get(path, {}, headers, opts)
  }

  getImageManifest(
    repoNamespace,
    repoName,
    tag,
    query,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/tags/${tag}/manifest`
    return super.get(path, query, headers, opts)
  }

  getImageScan(repoNamespace, repoName, tag, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/tags/${tag}/scan`
    return super.get(path, {}, headers, opts)
  }

  getMirrorList(headers = {}, opts = {}) {
    const path = `/mirrors`
    return super.get(path, {}, headers, opts)
  }

  getNamespace(namespace, headers = {}, opts = {}) {
    const path = `/namespace/${namespace}`
    return super.get(path, {}, headers, opts)
  }

  getNamespaceAuthorizationList(namespace, query, headers = {}, opts = {}) {
    const path = `/namespace/${namespace}/authorizations`
    return super.get(path, query, headers, opts)
  }

  getNamespaceList(query, headers = {}, opts = {}) {
    const path = `/namespace`
    return super.get(path, query, headers, opts)
  }

  getRegion(query, headers = {}, opts = {}) {
    const path = `/regions`
    return super.get(path, query, headers, opts)
  }

  getRegionList(headers = {}, opts = {}) {
    const path = `/regions`
    return super.get(path, {}, headers, opts)
  }

  getRepo(repoNamespace, repoName, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}`
    return super.get(path, {}, headers, opts)
  }

  getRepoAuthorizationList(
    repoNamespace,
    repoName,
    query,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/authorizations`
    return super.get(path, query, headers, opts)
  }

  getRepoBatch(query, headers = {}, opts = {}) {
    const path = `/batchsearch`
    return super.get(path, query, headers, opts)
  }

  getRepoBuildList(repoNamespace, repoName, query, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/build`
    return super.get(path, query, headers, opts)
  }

  getRepoBuildLogs(repoNamespace, repoName, buildId, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/build/${buildId}/logs`
    return super.get(path, {}, headers, opts)
  }

  getRepoBuildRuleList(repoNamespace, repoName, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/rules`
    return super.get(path, {}, headers, opts)
  }

  getRepoBuildStatus(
    repoNamespace,
    repoName,
    buildId,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/build/${buildId}/status`
    return super.get(path, {}, headers, opts)
  }

  getRepoList(query, headers = {}, opts = {}) {
    const path = `/repos`
    return super.get(path, query, headers, opts)
  }

  getRepoListByNamespace(repoNamespace, query, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}`
    return super.get(path, query, headers, opts)
  }

  getRepoSourceRepo(repoNamespace, repoName, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/sourceRepo`
    return super.get(path, {}, headers, opts)
  }

  getRepoSyncTask(
    repoNamespace,
    repoName,
    syncTaskId,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/syncTasks/${syncTaskId}`
    return super.get(path, {}, headers, opts)
  }

  getRepoSyncTaskList(repoNamespace, repoName, query, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/syncTasks`
    return super.get(path, query, headers, opts)
  }

  getRepoTags(repoNamespace, repoName, query, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/tags`
    return super.get(path, query, headers, opts)
  }

  getRepoWebhook(repoNamespace, repoName, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/webhooks`
    return super.get(path, {}, headers, opts)
  }

  getRepoWebhookLogList(
    repoNamespace,
    repoName,
    webhookId,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/webhooks/${webhookId}/logs`
    return super.get(path, {}, headers, opts)
  }

  getSearch(query, headers = {}, opts = {}) {
    const path = `/search-delete`
    return super.get(path, query, headers, opts)
  }

  getSubUserList(headers = {}, opts = {}) {
    const path = `/users/subAccount`
    return super.get(path, {}, headers, opts)
  }

  getUserInfo(headers = {}, opts = {}) {
    const path = `/users`
    return super.get(path, {}, headers, opts)
  }

  getUserSourceAccount(query, headers = {}, opts = {}) {
    const path = `/users/sourceAccount`
    return super.get(path, query, headers, opts)
  }

  getUserSourceRepoList(sourceAccountId, headers = {}, opts = {}) {
    const path = `/users/sourceAccount/${sourceAccountId}/repos`
    return super.get(path, {}, headers, opts)
  }

  getUserSourceRepoRefList(
    sourceAccountId,
    sourceRepoNamespace,
    sourceRepoName,
    headers = {},
    opts = {}
  ) {
    const path = `/users/sourceAccount/${sourceAccountId}/repos/${sourceRepoNamespace}/${sourceRepoName}/refs`
    return super.get(path, {}, headers, opts)
  }

  postRepoWebhook(
    repoNamespace,
    repoName,
    webhookId,
    body,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/webhooks-delete/${webhookId}`
    return super.post(path, {}, body, headers, opts)
  }

  searchRepo(query, headers = {}, opts = {}) {
    const path = `/search`
    return super.get(path, query, headers, opts)
  }

  startImageScan(repoNamespace, repoName, tag, body, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/tags/${tag}/scan`
    return super.put(path, {}, body, headers, opts)
  }

  startRepoBuild(repoNamespace, repoName, body, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/build`
    return super.put(path, {}, body, headers, opts)
  }

  startRepoBuildByRule(
    repoNamespace,
    repoName,
    buildRuleId,
    body,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/rules/${buildRuleId}/build`
    return super.put(path, {}, body, headers, opts)
  }

  updateNamespace(namespace, body, headers = {}, opts = {}) {
    const path = `/namespace/${namespace}`
    return super.post(path, {}, body, headers, opts)
  }

  updateNamespaceAuthorization(
    namespace,
    authorizeId,
    body,
    headers = {},
    opts = {}
  ) {
    const path = `/namespace/${namespace}/authorizations/${authorizeId}`
    return super.post(path, {}, body, headers, opts)
  }

  updateRepo(repoNamespace, repoName, body, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}`
    return super.post(path, {}, body, headers, opts)
  }

  updateRepoAuthorization(
    repoNamespace,
    repoName,
    authorizeId,
    body,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/authorizations/${authorizeId}`
    return super.post(path, {}, body, headers, opts)
  }

  updateRepoBuildRule(
    repoNamespace,
    repoName,
    buildRuleId,
    body,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/rules/${buildRuleId}`
    return super.post(path, {}, body, headers, opts)
  }

  updateRepoSourceRepo(repoNamespace, repoName, body, headers = {}, opts = {}) {
    const path = `/repos/${repoNamespace}/${repoName}/sourceRepo`
    return super.post(path, {}, body, headers, opts)
  }

  updateRepoWebhook(
    repoNamespace,
    repoName,
    webhookId,
    body,
    headers = {},
    opts = {}
  ) {
    const path = `/repos/${repoNamespace}/${repoName}/webhooks/${webhookId}`
    return super.post(path, {}, body, headers, opts)
  }

  updateUserInfo(body, headers = {}, opts = {}) {
    const path = `/users`
    return super.post(path, {}, body, headers, opts)
  }
}

export const client = new CrClient({
  endpoint: `http://cr.${regionId}.aliyuncs.com`,
  accessKeyId,
  accessKeySecret
})
