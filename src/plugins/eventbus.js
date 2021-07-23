/*
 * @Author: Whzcorcd
 * @Date: 2021-07-23 14:15:58
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-07-23 16:15:30
 * @Description: file content
 */
class EventBus {
  constructor() {
    this.event = {}
  }

  // 订阅
  $on(name, fn) {
    this.event[name] = this.event[name] || []
    this.event[name].push(fn)

    return this
  }

  // 发布
  $emit(name, data = {}) {
    if (this.event[name]) {
      this.event[name].forEach(fn => {
        typeof fn === 'function' && fn(data)
      })
    }

    return this
  }

  // 取消订阅
  $off(name) {
    if (this.event[name]) {
      delete this.event[name]
    }

    return this
  }
}

const instance = new EventBus()
export default instance
