/*
 * @Author: Whzcorcd
 * @Date: 2021-02-03 16:20:48
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-02-05 15:50:08
 * @Description: file content
 */
import { client } from '@/plugins/acr'
import { sleep } from '@/utils'
import { originalEnvTypes } from '@/modules/task/types'

const checkJobStatus = async (RepoNamespace, RepoName, delay = 3000) => {
  const {
    data: { builds }
  } = await client
    .getRepoBuildList(RepoNamespace, RepoName)
    .catch(err => console.error(err))
  console.log(builds)

  // 等待中或者构建中
  if (builds.find(item => item.buildStatus === 'BUILDING')) {
    return new Promise((resolve, reject) =>
      setTimeout(async () => {
        await checkJobStatus(RepoNamespace, RepoName).catch(err => reject(err))
        resolve()
      }, delay)
    )
  }

  // 判断通过状态，只允许完全成功
  return builds[0].buildStatus === 'SUCCESS'
    ? Promise.resolve()
    : Promise.reject(new Error('镜像打包失败'))
}

export const PackImagesTask = async ({
  RepoNamespace,
  RepoName,
  environment
}) => {
  console.log('packimages')
  console.log(RepoNamespace, RepoName, environment)

  const params = {
    BuildRule: {
      PushType: 'GIT_BRANCH', // 必填 枚举(GIT_BRANCH、GIT_TAG),
      PushName: originalEnvTypes.find(item => item.value === environment)
        .branchName, // 必填,
      DockerfileLocation: '/', // 必填 [1-128],
      DockerfileName: 'Dockerfile', // 必填 [4-64],
      Tag: 'v1' // 必填
    }
  }

  return new Promise(async (resolve, reject) => {
    try {
      const {
        data: { buildRuleId }
      } = await client.createRepoBuildRule(
        RepoNamespace,
        RepoName,
        JSON.stringify(params)
      )
      console.log(buildRuleId)
      const {
        data: { builds }
      } = await client.getRepoBuildList(RepoNamespace, RepoName)
      console.log(builds)
      if (builds.some(item => item.buildStatus === 'BUILDING')) {
        return reject(new Error('项目打包中，请稍后再次尝试'))
      }
      await client.startRepoBuildByRule(RepoNamespace, RepoName, buildRuleId)
      await client.deleteRepoBuildRule(RepoNamespace, RepoName, buildRuleId)
    } catch (err) {
      console.error(err)
      return reject(new Error('项目打包失败，请检查项目'))
    }

    // 等待，排除服务器接收信息时延的影响
    await sleep(3000)

    await checkJobStatus(RepoNamespace, RepoName).catch(err => {
      console.error(err)
      return reject(err)
    })

    return resolve('ok')
  })
}
