/*
 * @Author: Whzcorcd
 * @Date: 2020-12-09 11:31:59
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-09 11:34:24
 * @Description: file content
 */
import { ipcRenderer } from 'electron'

export const toggleDarkMode = async () => {
  const isDarkMode = await ipcRenderer.invoke('dark-mode:toggle')
  return Promise.resolve(isDarkMode)
}

export const resetToSystem = async () => {
  await ipcRenderer.invoke('dark-mode:system')
}
