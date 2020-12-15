/*
 * @Author: Whzcorcd
 * @Date: 2020-12-11 15:57:18
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-11 18:09:05
 * @Description: file content
 */
import { remote } from 'electron'

const { Menu, MenuItem } = remote

const menu = new Menu()
menu.append(
  new MenuItem({
    label: '文件',
    submenu: [
      {
        label: '首页',
        click: (item, window) => {
          window.webContents.send('router', '/')
        }
      },
      {
        type: 'separator'
      },
      {
        label: '退出',
        role: 'quit'
      }
    ]
  })
)
menu.append(
  new MenuItem({
    label: '编辑',
    submenu: [
      {
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: '重做',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  })
)
menu.append(new MenuItem({ type: 'separator' }))
menu.append(
  new MenuItem({
    label: '开发者选项',
    submenu: [
      {
        label: '切换全屏',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F'
          } else {
            return 'F11'
          }
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
          }
        }
      },
      {
        label: '切换开发者工具',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I'
          } else {
            return 'Ctrl+Shift+I'
          }
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.toggleDevTools()
          }
        }
      }
    ]
  })
)

window.addEventListener(
  'contextmenu',
  e => {
    e.preventDefault()
    menu.popup({ window: remote.getCurrentWindow() })
  },
  false
)
