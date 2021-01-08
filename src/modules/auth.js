/*
 * @Author: Whzcorcd
 * @Date: 2020-12-08 13:15:18
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2021-01-05 15:52:44
 * @Description: file content
 */
import { decrypt } from '#/plugins/encrypt'
import store from '@/store'
import { auth } from '@/config'

const insideDeveloperUsergroup = JSON.parse(window.$u)
const insidePMUsergroup = JSON.parse(window.$pm)
const insidePassword = window.$p
const { privatekey } = auth

store.dispatch('user/setUserList', {
  developersList: insideDeveloperUsergroup,
  productManagersList: insidePMUsergroup
})

export const login = async ({ username, password }) => {
  try {
    await store.dispatch('user/setUserSession', { username })
  } catch (err) {
    return Promise.reject(err)
  }

  const verification = decrypt({
    cipherText: insidePassword,
    privateKey: privatekey
  })
  console.log(verification)

  if (password === verification) return Promise.resolve()
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject()
}

export const logout = async () => {
  await store.dispatch('user/clearUserSession')
}
