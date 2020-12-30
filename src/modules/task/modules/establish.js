/*
 * @Author: Whzcorcd
 * @Date: 2020-12-24 16:42:33
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-30 17:13:57
 * @Description: file content
 */
import { Message } from 'element-ui'
import { sleep } from '@/utils'
import { getJobInfo, build } from '@/plugins/jenkins'

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
  return color === 'blue'
    ? Promise.resolve()
    : Promise.reject(new Error('Jenkins 通用构建任务中止或失败'))
}

export const EstablishTask = ({ jobName }) => {
  if (!jobName) return Promise.reject(new Error('参数 jobName 不能为空'))

  return new Promise(async (resolve, reject) => {
    console.log('establish')
    try {
      await build(jobName)
    } catch (err) {
      console.error(err)
      Message.error(`工作任务 ${jobName} 通用构建请求异常，请检查`)
      return reject(err)
    }

    await sleep(3000)

    await checkJobStatus(jobName).catch(err => {
      console.error(err)
      return reject(err)
    })

    return resolve('ok')
  })
}
