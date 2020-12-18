/*
 * @Author: Whzcorcd
 * @Date: 2020-12-18 15:52:37
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-18 15:59:08
 * @Description: file content
 */
import log from 'electron-log'

log.transports.console.level = 'silly'
log.transports.console.level = false
log.transports.file.level = 'info'
log.transports.file.maxSize = 100 * 1024 * 1024 // 日志大小最大 100M

log.warn('日志开始')

export { log }
