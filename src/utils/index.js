/*
 * @Author: Whzcorcd
 * @Date: 2020-12-09 17:27:59
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-25 00:45:32
 * @Description: file content
 */
import os from 'os'
import { execSync } from 'child_process'

export const sleep = (delay = 0) => {
  return new Promise(resolve => setTimeout(resolve, delay))
}

export const platform = os.platform()

export const isWin = platform === 'win32'
export const isMac = platform === 'darwin'
export const isLinux = platform === 'linux'

export const macVersion = () => {
  if (isMac) {
    let getVersion
    let isOldMacVersion = false
    try {
      const result = execSync('sw_vers').toString()
      getVersion = result.match(/ProductVersion:[ \t]*([\d.]*)/)[1]
      const matchedVersion = [10, 11, 0]
      const splited = getVersion.split('.')
      for (let i = 0; i < splited.length; i++) {
        if (splited[i] > matchedVersion[i]) {
          isOldMacVersion = false
          break
        } else if (splited[i] < matchedVersion[i]) {
          isOldMacVersion = true
          break
        } else if (i === 2 && splited[i] === matchedVersion[i]) {
          isOldMacVersion = true
        }
      }
    } catch (err) {
      console.error(err)
    }
    return {
      getVersion,
      isOldMacVersion
    }
  }
}
