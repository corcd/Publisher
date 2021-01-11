/*
 * @Author: Whzcorcd
 * @Date: 2021-01-11 01:37:46
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-11 11:31:20
 * @Description: file content
 */
const copy = value => {
  return JSON.parse(JSON.stringify(value))
}

export const isArrayEqual = (value1 = [], value2 = []) => {
  const temp = copy(value2)

  if (value1.length === value2.length) {
    for (let i = 0; i < value1.length; i++) {
      const index = temp.indexOf(value1[i])
      if (index > -1) {
        temp.splice(index, 1)
      } else {
        return false
      }
    }
    return true
  }

  return false
}
