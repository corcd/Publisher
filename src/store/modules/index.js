/*
 * @Author: Whzcorcd
 * @Date: 2020-12-28 14:52:57
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-28 14:53:10
 * @Description: file content
 */
const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return

  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default modules
