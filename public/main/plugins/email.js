/*
 * @Author: Whzcorcd
 * @Date: 2020-12-06 19:16:38
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-08 15:41:27
 * @Description: file content
 */
import { getMail } from '#/plugins/data'
import nodemailer from 'nodemailer'

export const sendEmail = async ({
  emailTopic,
  emailData,
  references = '',
  inReplyTo = ''
}) => {
  const { auth, addressee } = getMail()
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
