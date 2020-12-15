/*
 * @Author: Whzcorcd
 * @Date: 2020-12-10 12:54:13
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-10 17:08:06
 * @Description: file content
 */
import { remote } from 'electron'

const HtmlNotification = window.Notification
const { Notification } = remote

const isDesktopNotificationSupported = Notification.isSupported()

/**
 * 显示HTML5通知
 * @param {String} body 要显示的内容
 * @param {String} title 标题
 */
export const showHtmlNotification = ({ title = '通知', body }) => {
  // eslint-disable-next-line no-new
  new HtmlNotification(title, {
    body
  })
}

export const showNotification = ({
  title = '通知',
  body,
  onClickCallback = () => {
    // do nothing
  }
}) => {
  if (isDesktopNotificationSupported) {
    const notification = new Notification({
      title,
      body
      // silent: false
    })
    if (onClickCallback && typeof onClickCallback === 'function') {
      notification.once('click', onClickCallback)
    }
    notification.show()
  } else {
    showHtmlNotification(body, title)
  }
}
