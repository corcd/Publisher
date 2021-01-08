/*
 * @Author: Whzcorcd
 * @Date: 2020-12-24 16:41:21
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-06 11:34:40
 * @Description: file content
 */
import { updateRecord } from '#/plugins/data'
import { getJobInfo } from '@/plugins/jenkins'

export const UpdateTask = async ({ id, jobName }) => {
  console.log('update')

  try {
    const jobInfo = await getJobInfo(jobName)
    const { nextBuildNumber, lastSuccessfulBuild } = jobInfo.data
    const number = lastSuccessfulBuild ? lastSuccessfulBuild.number : 0
    const url = lastSuccessfulBuild ? lastSuccessfulBuild.url : ''

    updateRecord({ id, buildInfo: { number, nextBuildNumber, url } })
  } catch (err) {
    console.log(err)
    return Promise.reject(
      new Error('项目配置更新失败，请检查项目是否存在或合法')
    )
  }

  return Promise.resolve('ok')
}
