/*
 * @Author: Whzcorcd
 * @Date: 2020-12-24 16:43:41
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-28 14:43:55
 * @Description: file content
 */
import { Message } from 'element-ui'
import { showNotification } from '@/app/notification'
import { sleep } from '@/utils'
import { originalEnvTypes } from '@/modules/task/types'
import { getJobInfo, buildWithParams } from '@/plugins/jenkins'

const checkJobStatus = async (jobName, delay = 3000) => {
  const res = await getJobInfo(jobName).catch(err => console.error(err))
  if (!res) {
    return new Promise((resolve, reject) =>
      setTimeout(async () => {
        await checkJobStatus(jobName).catch(err => reject(err))
        resolve()
      }, delay)
    )
    // return Promise.reject(new Error())
  }

  // 排队中或者构建中
  const { color, inQueue } = res.data
  if (inQueue || color.includes('anime')) {
    return new Promise((resolve, reject) =>
      setTimeout(async () => {
        await checkJobStatus(jobName).catch(err => reject(err))
        resolve()
      }, delay)
    )
  }

  // 判断通过状态，只允许完全成功
  return color === 'blue' ? Promise.resolve() : Promise.reject(new Error())
}

export const ParametricBuildTask = ({ jobName, environment }) => {
  if (!jobName || !environment) {
    return Promise.reject(new Error('参数不能为空'))
  }
  if (!originalEnvTypes.some(item => item.value === environment)) {
    return Promise.reject(new Error('environment 参数不合法'))
  }

  const params = [
    { HOSTNAME: 'development', SCRIPT: 'build:dev', BRANCH: 'test' },
    { HOSTNAME: 'preview', SCRIPT: 'build:pre', BRANCH: 'dev' },
    { HOSTNAME: 'production', SCRIPT: 'build:prod', BRANCH: 'master' }
  ]

  return new Promise(async (resolve, reject) => {
    console.log('parametric build')
    const preload = params.filter(item => item.HOSTNAME === environment)[0]

    try {
      await buildWithParams(jobName, preload)
    } catch (err) {
      console.error(err)
      Message.error(`工作任务 ${jobName} 参数化构建请求异常，请检查`)
      return reject(err)
    }

    Message.info(`工作任务 ${jobName} 发起构建请求，等待构建`)
    await sleep(3000)

    await checkJobStatus(jobName).catch(err => {
      console.error(err)
      return reject(err)
    })

    showNotification({
      title: '前端参数化构建通知',
      body: `工作任务 ${jobName} 完成参数化构建`
    })
    return resolve('ok')
  })
}
