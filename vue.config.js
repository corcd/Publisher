/*
 * @Author: Whzcorcd
 * @Date: 2020-12-04 18:09:44
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-15 15:03:32
 * @Description: file content
 */
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias.set('#', resolve('public/main'))
    config.resolve.alias.set('*', resolve('src/app'))
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.gdyfe',
        productName: 'Publisher',
        copyright: 'Copyright © 2020 Whzcorcd',
        directories: {
          output: './dist_electron' // 输出文件路径
        },
        publish: [
          {
            provider: 'github',
            owner: 'corcd',
            repo: 'Publisher',
            releaseType: 'draft'
          }
        ],
        snap: {
          publish: ['github']
        },
        win: {
          // windows 相关配置
          icon: 'build/icons/icon.ico',
          target: [
            {
              target: 'nsis',
              arch: [
                'x64', // 64位
                'ia32' // 32位
              ]
            }
          ]
        },
        mac: {
          icon: 'build/icons/icon.icns',
          target: ['pkg', 'dmg', 'zip']
        },
        linux: {
          icon: 'build/icons/'
        },
        nsis: {
          shortcutName: 'Publisher',
          uninstallDisplayName: '卸载这个软件',
          oneClick: false,
          perMachine: false,
          allowToChangeInstallationDirectory: true,
          allowElevation: true,
          createDesktopShortcut: true
        }
      }
    }
  },
  css: {
    sourceMap: false,
    loaderOptions: {
      sass: {
        sourceMap: false
      }
    }
  }
}
