/*
 * @Author: Whzcorcd
 * @Date: 2020-12-18 15:51:49
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-09 16:14:16
 * @Description: file content
 */
import { autoUpdater } from 'electron-updater'
import { log } from '@/modules/logger'

// 发送请求更新
export const checkForUpdates = () => autoUpdater.checkForUpdates()

export const checkUpdate = win => {
  // 处理更新操作
  const returnData = {
    error: {
      status: -1,
      msg: '更新时发生意外，无法进行正常更新'
    },
    checking: {
      status: 0,
      msg: '正在检查更新'
    },
    updateAva: {
      status: 1,
      msg: '正在更新中，请稍等'
    },
    updateNotAva: {
      status: 2,
      msg: '当前已是最新版本，无需更新'
    }
  }

  // 发送消息给窗口
  const sendUpdateMessage = text => {
    win.webContents.send('message', text)
  }

  // 更新连接
  autoUpdater.checkForUpdatesAndNotify()

  // 更新错误事件
  autoUpdater.on('error', error => {
    sendUpdateMessage(returnData.error)
    log.info(returnData.error, error)
  })

  // 检查事件
  autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage(returnData.checking)
    log.info(returnData.checking)
  })

  // 发现新版本
  autoUpdater.on('update-available', () => {
    sendUpdateMessage(returnData.updateAva)
    log.info(returnData.updateAva)
  })

  // 当前版本为最新版本
  autoUpdater.on('update-not-available', () => {
    setTimeout(() => {
      sendUpdateMessage(returnData.updateNotAva)
      log.info(returnData.updateNotAva)
    }, 1000)
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', progressObj => {
    win.webContents.send('downloadProgress', progressObj)
    log.info('正在下载', progressObj)
  })

  // 下载完毕
  autoUpdater.on('update-downloaded', () => {
    // TODO 退出并进行安装（这里可以做成让用户确认后再调用）
    autoUpdater.quitAndInstall()
    log.info('下载完毕')
  })
}
