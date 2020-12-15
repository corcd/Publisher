/*
 * @Author: Whzcorcd
 * @Date: 2020-12-05 16:19:23
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-06 20:24:03
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

const _config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  timeout: 10 * 1000 // Timeout
}

const _axios = axios.create(_config)

_axios.interceptors.request.use(
  config => {
    // Do something before request is sent
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
    // Do something with response data
    return response
  },
  error => {
    // Do something with response error
    return Promise.reject(error)
  }
)

// Plugin.install = (vue, options) => {
//   vue.axios = _axios
//   window.axios = _axios
//   Object.defineProperties(vue.prototype, {
//     axios: {
//       get() {
//         return _axios
//       }
//     },
//     $axios: {
//       get() {
//         return _axios
//       }
//     }
//   })
// }

export default _axios
