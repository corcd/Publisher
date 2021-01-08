/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/*
 * @Author: Whzcorcd
 * @Date: 2021-01-06 17:42:15
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-08 17:00:39
 * @Description: file content
 */
import { sendEmail } from '#/plugins/email'
import { getMail } from '#/plugins/data'
import { getEmailReplyText } from '@/plugins/text'
// import * as imaps from 'imap-simple'
const simpleParser = window.require('mailparser').simpleParser
const imaps = window.require('imap-simple')

const { auth } = getMail()
const config = {
  imap: {
    user: auth.user,
    password: auth.pass,
    host: 'imap.exmail.qq.com',
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false
    },
    authTimeout: 3000
  },
  onmail: numNewMail => {
    console.log('new mail!' + numNewMail.toString())
  }
}

export const receiveEmail = async () => {
  const connection = await imaps.connect(config)
  connection.on('error', err => {
    console.error('got fatal error during imap operation, stop app.', err)
  })

  try {
    await connection.openBox('INBOX')
    console.log('connected to imap')

    // 一天间隔收件
    const delay = 24 * 3600 * 1000
    const yesterday = new Date()
    yesterday.setTime(Date.now() - delay)
    const searchCriteria = [['SINCE', yesterday.toISOString()]]
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      markSeen: false
    }

    const results = await connection.search(searchCriteria, fetchOptions)
    if (!results.length) {
      console.error('can not search')
      connection.end()
      return Promise.reject(new Error('can not search'))
    }
    console.log(results)

    const subjects = await Promise.all(
      results.map(async res => {
        const content = Buffer.from(
          res.parts.find(part => part.which === 'TEXT').body,
          'base64'
        ).toString('utf8')

        const uid = res.attributes.uid
        const idHeader = 'Imap-Id: ' + uid + '\r\n'
        const parsed = await simpleParser(
          idHeader + res.parts.find(part => part.which === 'TEXT').body
        )

        const messageId = res.parts.find(part => part.which === 'HEADER').body[
          'message-id'
        ]
          ? res.parts.find(part => part.which === 'HEADER').body[
              'message-id'
            ][0]
          : ''

        const date = res.parts.find(part => part.which === 'HEADER').body
          .date[0]

        const subject = res.parts.find(part => part.which === 'HEADER').body
          .subject
          ? res.parts.find(part => part.which === 'HEADER').body.subject[0]
          : ''

        return {
          uid,
          messageId,
          date,
          subject,
          html: content,
          text: parsed.textAsHtml
        }
      })
    )
    console.log(subjects)
    const filteredSubjects = subjects.filter(
      item =>
        !(item.subject.includes('回复：') || item.subject.includes('Re:')) &&
        (item.subject.includes('[测试环境]') ||
          item.subject.includes('[预发环境]') ||
          item.subject.includes('[生产环境]'))
    )

    const filteredReplySubjects = subjects.filter(
      item =>
        (item.subject.includes('回复：') || item.subject.includes('Re:')) &&
        (item.subject.includes('[测试环境]') ||
          item.subject.includes('[预发环境]') ||
          item.subject.includes('[生产环境]'))
    )
    console.log(filteredSubjects, filteredReplySubjects)
    connection.end()
    return Promise.resolve({ filteredSubjects, filteredReplySubjects })
  } catch (err) {
    console.error(err)
    connection.end()
    return Promise.reject(err)
  }
}

export const setEmailSeen = async uid => {
  const connection = await imaps.connect(config)
  connection.on('error', err => {
    console.error('got fatal error during imap operation, stop app.', err)
  })

  try {
    await connection.openBox('INBOX')
    console.log('connected to imap')

    connection.addFlags(uid, '\\Seen', err => {
      if (err) {
        console.log('Problem marking message for seen')
        connection.end()
        return Promise.reject(err)
      }

      connection.end()
      return Promise.resolve()
    })
  } catch (err) {
    console.error(err)
    connection.end()
    return Promise.reject(err)
  }
}

export const replyEmail = async (messageId, subject) => {
  const data = getEmailReplyText(subject)

  await sendEmail({
    emailTopic: data.theme,
    emailData: data.content,
    references: [messageId.trim()],
    inReplyTo: messageId.trim()
  }).catch(err => {
    return Promise.reject(err)
  })
}
