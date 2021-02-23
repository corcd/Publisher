/*
 * @Author: Whzcorcd
 * @Date: 2020-12-24 16:45:40
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-02-05 17:50:05
 * @Description: file content
 */
const k8s = require('@kubernetes/client-node')
import { client } from '@/plugins/ack'

const defaultKubeInfo = {
  cluster: 'cluster-02',
  namespace: 'default',
  name: 'web-live-test'
}

export const DeployTask = async (projectName, target) => {
  console.log('deploy')

  const { clusters } = await client.describeClustersV1({
    page_size: 20,
    page_number: 1
  })
  console.log(clusters)
  const cluster = clusters.find(item => item.name === defaultKubeInfo.cluster)

  const { config } = await client.describeClusterUserKubeconfig(
    cluster.cluster_id
  )
  const kc = new k8s.KubeConfig()
  kc.loadFromString(config)

  const k8sApi = kc.makeApiClient(k8s.AppsV1Api)

  const { body } = await k8sApi.readNamespacedDeployment(
    defaultKubeInfo.name,
    defaultKubeInfo.namespace
  )
  console.log(body)

  body.spec.replicas++

  // replace
  await k8sApi.replaceNamespacedDeployment(
    defaultKubeInfo.name,
    defaultKubeInfo.namespace,
    body
  )

  return Promise.resolve('ok')
}
