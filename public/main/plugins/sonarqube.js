/*
 * @Author: Whzcorcd
 * @Date: 2021-01-09 10:00:58
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-09 15:29:41
 * @Description: file content
 */
import scanner from 'sonarqube-scanner'
import { sonarqube } from '@/config'

const {
  server,
  authorization: { token }
} = sonarqube

export const scan = async (projectName, tmpPath) => {
  return new Promise((resolve, reject) => {
    const config = {
      serverUrl: server,
      token,
      options: {
        'sonar.projectKey': projectName,
        'sonar.projectName': 'Static-Scan',
        'sonar.projectDescription': '云平台前端代码质量基础扫描',
        'sonar.sourceEncoding': 'UTF-8',
        'sonar.language': 'js',
        'sonar.sources': tmpPath
      }
    }
    try {
      scanner(config, () => {
        return resolve()
      })
    } catch (error) {
      return reject(error)
    }
  })
}
