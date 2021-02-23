/*
 * @Author: Whzcorcd
 * @Date: 2021-02-02 17:42:55
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-02-03 15:10:09
 * @Description: file content
 */
import http from 'http'
import crypto from 'crypto'
import { nanoid } from 'nanoid'
import { aliyun } from '@/config'

const { regionId, authorization } = aliyun

const getSignature = ({ method, headers, path }) => {
  const { accessKeyId, accessKeySecret } = authorization
  const signature = [
    `${method.toUpperCase()}\n`,
    `${headers['Accept']}\n`,
    `${headers['Content-MD5']}\n`,
    `${headers['Content-Type']}\n`,
    `${headers['Date']}\n`,
    `x-acs-region-id:${headers['x-acs-region-id']}\n`,
    `x-acs-signature-method:${headers['x-acs-signature-method']}\n`,
    `x-acs-signature-nonce:${headers['x-acs-signature-nonce']}\n`,
    `x-acs-signature-version:${headers['x-acs-signature-version']}\n`,
    `x-acs-version:${headers['x-acs-version']}\n`,
    `${path}`
  ]

  const token = crypto
    .createHmac('sha1', accessKeySecret)
    .update(signature.join(''))
    .digest()
    .toString('base64')

  return `acs ${accessKeyId}:${token}`
}

const request = (path, method, body = null) => {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-acs-version': '2016-06-07',
    'x-acs-signature-version': '1.0',
    'x-acs-signature-method': 'HMAC-SHA1'
  }

  const headers = {
    Date: new Date().toUTCString(),
    'x-acs-signature-nonce': nanoid(),
    'x-acs-region-id': regionId,
    'Content-MD5': crypto
      .createHash('md5')
      .update(JSON.stringify(body))
      .digest('base64'),
    ...defaultHeaders
  }
  headers['Authorization'] = getSignature({ method, headers, path })
  console.log(headers)

  return new Promise((resolve, reject) => {
    // GET
    if (method.toUpperCase() === 'GET') {
      http
        .get(`http://cr.${regionId}.aliyuncs.com${path}`, res => {
          console.log(res)
          const { statusCode } = res
          const contentType = res.headers['content-type']

          let error
          if (statusCode !== 200) {
            error = new Error(`请求失败\n状态码: ${statusCode}`)
          } else if (!/^application\/json/.test(contentType)) {
            error = new Error(
              `无效的 content-type.\n期望的是 application/json 但接收到的是 ${contentType}`
            )
          }
          if (error) {
            console.error(error.message)
            // 消费响应的数据来释放内存。
            res.resume()
            return
          }

          res.setEncoding('utf8')

          let rawData = ''
          res.on('data', chunk => {
            rawData += chunk
          })
          res.on('end', () => {
            try {
              const result = JSON.parse(rawData)
              console.log(result)
              return resolve(result.data[0])
            } catch (err) {
              console.error(err.message)
              return reject(err)
            }
          })
        })
        .on('error', err => {
          console.error(`出现错误: ${err.message}`)
          return reject(err)
        })
    }

    // PUT、POST、DELETE
    const req = http.request(
      {
        hostname: `cr.${regionId}.aliyuncs.com`,
        port: 80,
        path,
        method,
        insecureHTTPParser: true,
        headers
      },
      res => {
        const { statusCode } = res
        const contentType = res.headers['content-type']

        let error
        if (statusCode !== 200) {
          error = new Error(`请求失败\n状态码: ${statusCode}`)
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(
            `无效的 content-type.\n期望的是 application/json 但接收到的是 ${contentType}`
          )
        }
        if (error) {
          console.error(error.message)
          // 消费响应的数据来释放内存。
          res.resume()
          return
        }

        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', chunk => {
          rawData += chunk
        })
        res.on('end', () => {
          try {
            const result = JSON.parse(rawData)
            console.log(result)
            return resolve(result.data[0])
          } catch (err) {
            console.error(err.message)
            return reject(err)
          }
        })
      }
    )
    req.write(JSON.stringify(body))
    req.on('error', err => {
      console.error(err.message)
      return reject(err)
    })
    req.end()
  })
}

// 获取构建规则列表
export const GetRepoBuildRuleList = (RepoNamespace, RepoName) => {
  return request(`/repos/${RepoNamespace}/${RepoName}/rules`, 'GET', {})
}
