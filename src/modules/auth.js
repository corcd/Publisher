/*
 * @Author: Whzcorcd
 * @Date: 2020-12-08 13:15:18
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-19 14:32:57
 * @Description: file content
 */
import { decrypt } from '#/plugins/encrypt'
import { auth } from '@/config'

const insideUsergroup = JSON.parse(window.$u)
const insidePassword = window.$p
const { privatekey } = auth

export const login = ({ username, password }) => {
  if (!insideUsergroup.includes(username)) return false

  const verification = decrypt({
    cipherText: insidePassword,
    privateKey: privatekey
  })
  console.log(verification)

  if (password === verification) return true
  return false
}

export const logout = () => {
  // TODO 登出功能
}
