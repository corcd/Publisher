/*
 * @Author: Whzcorcd
 * @Date: 2020-12-04 18:09:44
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-07-25 22:50:31
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
    config.optimization.splitChunks({
      chunks: 'all',
      minSize: 30000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: 3,
      automaticNameDelimiter: '-',
      cacheGroups: {
        libs: {
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-libs',
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        },
        elementUI: {
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          name: 'chunk-elementUI', // 单独将 elementUI 拆包
          priority: 20 // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
        },
        commons: {
          name: 'chunk-commons',
          minChunks: 2, // 最小共用次数
          priority: 10
        }
      }
    })
  },
  configureWebpack: {
    // bug from 'iconv-lite', https://github.com/ashtuchkin/iconv-lite/issues/204
    module: {
      rules: [
        {
          test: /node_modules[\\/\\](iconv-lite)[\\/\\].+/,
          resolve: {
            aliasFields: ['main']
          }
        }
      ]
    }
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
                'x64' // 64位
              ]
            }
          ]
        },
        mac: {
          icon: 'build/icons/icon.icns',
          target: ['zip', 'pkg', 'dmg']
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
        sourceMap: false,
        prependData: `@import "~@/assets/styles/element-variables.scss";`
      }
    }
  }
}
