/*
 * @Author: Whzcorcd
 * @Date: 2020-12-06 19:16:38
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-13 14:46:37
 * @Description: file content
 */
import nodemailer from 'nodemailer'
import imaps from 'imap-simple'
import utf8 from 'utf8'
import quotedPrintable from 'quoted-printable'
import { simpleParser } from 'mailparser'
import { getMail } from '#/plugins/data'
import { getEmailReplyText } from '@/plugins/text'

const { auth, addressee } = getMail()
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
  }
}

export const sendEmail = async ({
  emailTopic,
  emailData,
  references = '',
  inReplyTo = ''
}) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.exmail.qq.com',
    port: 465,
    secure: true,
    auth: auth
  })

  await transporter.sendMail({
    from: auth.user,
    subject: emailTopic,
    to: addressee,
    references,
    inReplyTo,
    text: emailData
  })
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
        const HEADER = res.parts.find(part => part.which === 'HEADER')
        const TEXT = res.parts.find(part => part.which === 'TEXT')

        const content =
          HEADER.body['content-transfer-encoding'] &&
          HEADER.body['content-transfer-encoding'].includes('quoted-printable')
            ? utf8.decode(quotedPrintable.decode(TEXT.body))
            : Buffer.from(TEXT.body, 'base64').toString('utf8')

        const uid = res.attributes.uid
        const idHeader = 'Imap-Id: ' + uid + '\r\n'
        const parsed = await simpleParser(idHeader + TEXT.body)

        const messageId = HEADER.body['message-id']
          ? HEADER.body['message-id'][0]
          : ''

        const date = HEADER.body.date[0]

        const subject = HEADER.body.subject ? HEADER.body.subject[0] : ''

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
    // console.log(subjects)
    const filteredSubjects = subjects.filter(
      item =>
        item.subject.includes('[测试环境]') ||
        item.subject.includes('[预发环境]') ||
        item.subject.includes('[生产环境]')
    )

    const filteredUpdateSubjects = filteredSubjects.filter(
      item => !item.subject.includes('回复：') && !item.subject.includes('Re:')
    )
    const filteredReplySubjects = filteredSubjects.filter(
      item => item.subject.includes('回复：') || item.subject.includes('Re:')
    )
    console.log(
      filteredSubjects.length,
      filteredUpdateSubjects.length,
      filteredReplySubjects.length
    )
    await connection.end()
    return Promise.resolve({ filteredUpdateSubjects, filteredReplySubjects })
  } catch (err) {
    console.error(err)
    await connection.end()
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

    connection.addFlags(uid, '\\Seen', async err => {
      if (err) {
        console.log('Problem marking message for Seen')
        connection.end()
        return Promise.reject(err)
      }

      await connection.end()
      return Promise.resolve()
    })
  } catch (err) {
    console.error(err)
    await connection.end()
    return Promise.reject(err)
  }
}

export const setEmailAnswered = async uid => {
  const connection = await imaps.connect(config)
  connection.on('error', err => {
    console.error('got fatal error during imap operation, stop app.', err)
  })

  try {
    await connection.openBox('INBOX')
    console.log('connected to imap')

    connection.addFlags(uid, '\\Answered', async err => {
      if (err) {
        console.log('Problem marking message for Answered')
        connection.end()
        return Promise.reject(err)
      }

      await connection.end()
      return Promise.resolve()
    })
  } catch (err) {
    console.error(err)
    await connection.end()
    return Promise.reject(err)
  }
}

export const replyEmail = async (messageId, subject, verified = true) => {
  const data = getEmailReplyText(subject, verified)

  await sendEmail({
    emailTopic: data.theme,
    emailData: data.content,
    references: [messageId.trim()],
    inReplyTo: messageId.trim()
  }).catch(err => {
    return Promise.reject(err)
  })
}
