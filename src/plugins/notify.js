/*
 * @Author: Whzcorcd
 * @Date: 2020-12-04 17:21:27
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-15 10:13:28
 * @Description: file content
 */
import { sendEmail } from '#/plugins/email'
import { getLastBuildNumber, getBuildInfo } from './jenkins'
import { getWechatStyleText, getEmailStyleText } from './text'

export const sendWechatNotification = ({
  name,
  jobName,
  environment,
  updatedContent
}) => {
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
  return fetch(
    'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=342b0cee-0e35-4067-939a-82acc4c38031',
    {
      body: JSON.stringify(data),
      cache: 'no-cache',
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      mode: 'no-cors',
      referrer: 'no-referrer'
    }
  )
}

export const sendEmailNotification = async ({
  name,
  jobName,
  environment,
  updatedContent
}) => {
  const res = await getLastBuildNumber(jobName).catch(err => console.error(err))

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

  sendEmail({
    emailTopic: data.theme,
    emailData: data.content
  })
}
