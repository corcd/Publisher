/*
 * @Author: Whzcorcd
 * @Date: 2020-12-05 16:19:23
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-16 16:47:53
 * @Description: file content
 */
/*
 * @Author: Whzcorcd
 * @Date: 2020-12-05 15:22:30
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-05 16:18:57
 * @Description: file content
 */
import axios from 'axios'

const toType = obj => {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase()
}

const filterNull = obj => {
  for (const key in obj) {
    if (obj[key] === null) {
      delete obj[key]
    } else {
      if (toType(obj[key]) === 'string') {
        obj[key] = obj[key].trim()
      } else if (toType(obj[key]) === 'object') {
        obj[key] = filterNull(obj[key])
      } else if (toType(obj[key]) === 'array') {
        obj[key] = filterNull(obj[key])
      }
    }
  }
  return obj
}

const _config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  timeout: 5 * 1000 // Timeout
}

const _axios = axios.create(_config)

_axios.interceptors.request.use(
  config => {
    if (config.method === 'get') {
      const data = filterNull(config.data)
      config.params = data
    }
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response)
    } else {
      // 请求已发出，在 2xx 的范围，但不等于 200/201
      return Promise.reject(response)
    }
  },
  error => {
    const { err } = error
    if (err) {
      // 请求已发出，但是不在 2xx 的范围
      return Promise.reject(err)
    } else {
      if (!window.navigator.onLine) {
        // 处理断网的情况
        return Promise.reject(error)
      } else {
        return Promise.reject(error)
      }
    }
  }
)

export default _axios
