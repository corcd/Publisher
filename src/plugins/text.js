/*
 * @Author: Whzcorcd
 * @Date: 2020-12-07 13:22:06
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-08 17:23:21
 * @Description: file content
 */
import dayjs from 'dayjs'
import { customAlphabet } from 'nanoid'
import { getUser } from '#/plugins/data'

const nanoid = customAlphabet('1234567890abcdef', 10)

export const getWechatStyleText = ({
  name,
  jobName,
  environment,
  updatedContent
}) => {
  const serializeUpdatedContent = content => {
    if (!content) return '<font color="comment">( 无 )</font>\n'

    return content.split('\n').reduce((acc, value, index) => {
      return acc.concat(`<font color="comment">${index + 1}.${value}</font>\n`)
    }, '')
  }

  return `**<font color="info">${name}</font> 项目发布更新**\n>项目名: <font color="comment">${jobName}</font>\n>发布环境: <font color="comment">${environment}</font>\n>发布时间: <font color="comment">${dayjs().format(
    'YYYY-MM-DD HH:mm:ss'
  )}</font>\n>操作人员: <font color="comment">${
    getUser().name
  }</font>\n>更新内容:\n${serializeUpdatedContent(updatedContent)}`
}

export const getEmailStyleText = ({
  name,
  environment,
  updatedContent,
  lastBuildBranch,
  lastBuildHash
}) => {
  const serializeUpdatedContent = content => {
    if (!content) return '( 无 )\n'

    return content.split('\n').reduce((acc, value, index) => {
      return acc.concat(`${index + 1}. ${value}\n`)
    }, '')
  }

  const profile = `\n\n\n------------------------------------\n杭州奥点科技股份有限公司\n\n云平台前端工程师: ${
    getUser().name
  }\n联系方式: ${getUser().contact}\n工作邮箱: ${getUser().workmail}`

  return {
    theme: `[${environment}] 广电云更新-${name}项目-${
      getUser().name
    } Publisher<${nanoid()}>`,
    content: `（此邮件通过 Publisher 发送）\n\n发布项目: ${name}\n\n更改内容:\n${serializeUpdatedContent(
      updatedContent
    )}\n最近一次构建: <${lastBuildBranch}> ${lastBuildHash}\n\n提交人: ${
      getUser().name
    }\n发布时间: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`.concat(profile)
  }
}

export const getEmailReplyText = subject => {
  const profile = `\n\n\n------------------------------------\n杭州奥点科技股份有限公司\n\n云平台产品经理: ${
    getUser().name
  }\n联系方式: ${getUser().contact}\n工作邮箱: ${getUser().workmail}`

  return {
    theme: `Re: ${subject}`,
    content: `（此邮件通过 Publisher 发送）\n\n验证测试通过\n验证时间: ${dayjs().format(
      'YYYY-MM-DD HH:mm:ss'
    )}`.concat(profile)
  }
}
