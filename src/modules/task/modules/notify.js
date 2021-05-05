/*
 * @Author: Whzcorcd
 * @Date: 2020-12-24 16:44:43
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-05-05 12:57:50
 * @Description: file content
 */
import { showNotification } from '@/app/notification'
import { originalEnvTypes } from '@/modules/task/types'
import { sendWechatNotification, sendEmailNotification } from '@/plugins/notify'

export const NotifyTask = async ({
  name,
  jobName,
  environment,
  updatedContent
}) => {
  if (!name || !jobName || !environment) {
    return Promise.reject(new Error('除更新内容外其他参数不能为空'))
  }
  if (!originalEnvTypes.some(item => item.value === environment)) {
    return Promise.reject(new Error('environment 参数不合法'))
  }

  console.log('notify')

  try {
    await sendWechatNotification({
      name,
      jobName,
      environment,
      updatedContent
    })

    await sendEmailNotification({
      name,
      jobName,
      environment,
      updatedContent
    })
  } catch (err) {
    console.error(err)
    showNotification({
      title: '通知发送异常通知',
      body: `项目 ${name} 通知发送异常，请检查`
    })
    return Promise.reject(err)
  }

  return Promise.resolve('ok')
}
