/*
 * @Author: Whzcorcd
 * @Date: 2020-12-04 18:14:05
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-04 18:17:47
 * @Description: file content
 */
import router from '@/router'

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    // 判断是否有标题
    console.log(to.meta.title)
    document.title = to.meta.title
  } else {
    document.title = 'Publisher'
  }
  next()
})
