/*
 * @Author: Whzcorcd
 * @Date: 2020-12-06 19:16:38
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-26 22:24:43
 * @Description: file content
 */
import { getMail } from '#/plugins/data'
import nodemailer from 'nodemailer'

export const sendEmail = async ({ emailTopic, emailData }) => {
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
    text: emailData
  })
}
