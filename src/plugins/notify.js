/*
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:21:27
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-07-17 00:06:35
 * @Description: file content
 */
import { sendEmail } from '#/plugins/email'
import { getLastBuildNumber, getBuildInfo } from './jenkins'
import { getWechatStyleText, getEmailStyleText } from './text'
import { originalEnvTypes } from '@/modules/task/types'

const getIncludedType = environment =>
  originalEnvTypes.find(item => item.value === environment)

export const sendWechatNotification = ({
  name,
  jobName,
  environment,
  updatedContent,
  mentionedMobileList
}) => {
  return new Promise(async (resolve, reject) => {
    const { label, webhook } = getIncludedType(environment)

    const updateInfo = {
      msgtype: 'markdown',
      markdown: {
        content: getWechatStyleText({
          name,
          jobName,
          environment: label,
          updatedContent
        })
      }
    }

    const updateMessage = {
      msgtype: 'text',
      text: {
        content: `[${label}] ${name} 已完成更新`,
        mentioned_mobile_list: mentionedMobileList
      }
    }

    const notifyLoop = content =>
      webhook.map(url => {
        return fetch(url, {
          body: JSON.stringify(content),
          cache: 'no-cache',
          headers: {
            'content-type': 'application/json'
          },
          method: 'POST',
          mode: 'no-cors',
          referrer: 'no-referrer'
        })
      })

    await Promise.all(notifyLoop(updateInfo)).catch(err => {
      console.error(err)
      return reject(err)
    })
    await Promise.all(notifyLoop(updateMessage)).catch(err => {
      console.error(err)
      return reject(err)
    })

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
    const { label } = getIncludedType(environment)

    const res = await getLastBuildNumber(jobName).catch(err =>
      console.error(err)
    )

    if (!res) {
      // 无信息
      const data = getEmailStyleText({
        name,
        environment: label,
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
    }

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
      environment: label,
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
  })
}
