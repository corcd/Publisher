/*
 * @Author: Whzcorcd
 * @Date: 2021-01-04 11:40:11
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-04 17:43:56
 * @Description: file content
 */
import xml2js from 'xml2js'

// TODO 按需引入
export const parseXml = (str = '') => {
  const parser = new xml2js.Parser({ trim: true })

  return new Promise((resolve, reject) => {
    parser.parseString(str, (err, result) => {
      if (err) {
        console.error(err)
        return reject(err)
      }

      console.log(result)
      return resolve(result)
    })
  })
}
