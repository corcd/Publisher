/*
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:21:27
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-23 12:20:20
 * @Description: file content
 */
import { sendEmail } from '#/plugins/email'
import { getLastBuildNumber, getBuildInfo } from './jenkins'
import { getWechatStyleText, getEmailStyleText } from './text'

export const sendWechatNotification = ({
  name,
  jobName,
  environment,
  updatedContent,
  onlyDeveloper = true
}) => {
  return new Promise(async (resolve, reject) => {
    const data = {
      msgtype: 'markdown',
      markdown: {
        content: getWechatStyleText({
          name,
          jobName,
          environment,
          updatedContent
        })
      }
    }

    const baseNotifyWebhookUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=342b0cee-0e35-4067-939a-82acc4c38031'
        : 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=afaa2567-4ad4-4aa4-93ba-44df4a776242'

    const globalNotifyWebhookUrl =
      'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=99f8dc79-a6bd-4328-8569-9897cc9110e1'

    // 仅通知研发人员
    await fetch(baseNotifyWebhookUrl, {
      body: JSON.stringify(data),
      cache: 'no-cache',
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      mode: 'no-cors',
      referrer: 'no-referrer'
    }).catch(err => {
      return reject(err)
    })

    if (!onlyDeveloper) {
      // 全局通知
      await fetch(globalNotifyWebhookUrl, {
        body: JSON.stringify(data),
        cache: 'no-cache',
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
        mode: 'no-cors',
        referrer: 'no-referrer'
      }).catch(err => {
        return reject(err)
      })
    }

    return resolve()
  })
}

export const sendEmailNotification = ({
  name,
  jobName,
  environment,
  updatedContent
}) => {
  return new Promise(async (resolve, reject) => {
    const res = await getLastBuildNumber(jobName).catch(err =>
      console.error(err)
    )

    if (res) {
      const buildInfo = await getBuildInfo(jobName, res.data).catch(err =>
        console.error(err)
      )
      const { actions } = buildInfo.data
      const buildData = actions.filter(
        item => item._class === 'hudson.plugins.git.util.BuildData'
      )
      const branchInfo = buildData
        ? buildData[0].lastBuiltRevision.branch[0]
        : { name: '( 无 )', SHA1: '( 无 )' }

      const data = getEmailStyleText({
        name,
        environment,
        updatedContent,
        lastBuildBranch: branchInfo.name,
        lastBuildHash: branchInfo['SHA1']
      })
      await sendEmail({
        emailTopic: data.theme,
        emailData: data.content
      }).catch(err => {
        return reject(err)
      })

      return resolve()
    }

    // 无信息
    const data = getEmailStyleText({
      name,
      environment,
      updatedContent,
      lastBuildBranch: 'none',
      lastBuildHash: '无'
    })
    await sendEmail({
      emailTopic: data.theme,
      emailData: data.content
    }).catch(err => {
      return reject(err)
    })

    return resolve()
  })
}
