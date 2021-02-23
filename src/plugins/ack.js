/*
 * @Author: Whzcorcd
 * @Date: 2021-02-05 15:51:14
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-02-05 16:46:57
 * @Description: file content
 */
import { ROAClient } from '@alicloud/pop-core'
import { aliyun } from '@/config'

const { regionId, authorization } = aliyun
const { accessKeyId, accessKeySecret } = authorization

class CsClient extends ROAClient {
  constructor(config) {
    config.apiVersion = '2015-12-15'
    super(config)
  }

  describeClustersV1(body = {}, headers = {}, opts = {}) {
    const path = `/api/v1/clusters`
    return super.get(path, {}, body, headers, opts)
  }

  describeClusterNodes(ClusterId, body = {}, headers = {}, opts = {}) {
    const path = `/clusters/${ClusterId}/nodes`
    return super.get(path, {}, body, headers, opts)
  }

  describeClusterUserKubeconfig(ClusterId, body = {}, headers = {}, opts = {}) {
    const path = `/k8s/${ClusterId}/user_config`
    return super.get(path, {}, body, headers, opts)
  }
}

export const client = new CsClient({
  endpoint: `http://cs.${regionId}.aliyuncs.com`,
  accessKeyId,
  accessKeySecret
})
