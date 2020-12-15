/*
 * @Author: Whzcorcd
 * @Date: 2020-12-06 19:16:38
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-13 16:57:41
 * @Description: file content
 */
import { getMail } from '#/plugins/lowdb'
import nodemailer from 'nodemailer'

export const sendEmail = async ({ emailTopic, emailData }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.exmail.qq.com',
    port: 465,
    secure: true,
    auth: getMail.auth
  })
  await transporter.sendMail({
    from: getMail.auth.user,
    subject: emailTopic,
    to: getMail.addressee,
    text: emailData
  })
}
