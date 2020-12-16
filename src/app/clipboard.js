/*
 * @Author: Whzcorcd
 * @Date: 2020-12-16 09:36:38
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-16 09:39:49
 * @Description: file content
 */
import { clipboard } from 'electron'

export const setText = text => {
  clipboard.writeText(text)
}

export const getText = () => {
  return clipboard.readText()
}
