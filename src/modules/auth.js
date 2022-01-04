/*
 * @Author: Whzcorcd
 * @Date: 2020-12-08 13:15:18
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2022-01-04 09:35:56
 * @Description: file content
 */
import { decrypt } from '#/plugins/encrypt'
import store from '@/store'
import { auth } from '@/config'

const insideDeveloperUsergroup = [
  'wanghanze',
  'chenbobing',
  'laihuiliang',
  'shijiawei'
] // JSON.parse(window.$u)
const insidePMUsergroup = ['majinya'] // JSON.parse(window.$pm)
const insidePassword = `crqnFhAF4td6VRaEWlaK6zNQMKfDBQh5eUf/cPcfkxqBtuFIHwyT8L+6a5gMNYG2F/N5tcXQXMcyCpzWDJuVcjD0k/q4j18xJ0bbn/r0S+/Ril9Hy7S4yiwvwqXVgHec6rcYEFFPAp0vX1Atj19aa5jDlZxGcHvkXWmgTwUDdMiy7bKNIgbaOCF64SsqX6DQxXXJYzp1rGYSyEZrdf6k3yQpjQvTUKswHh+7Mvf2AHVz3/y2tgQVyKlyXAfBXf2/fL1ugqrpy52HiTkIjOyBcgKrg3L40kbQL0PUXUo6y/0ESM1AxkrDW04u41FcbdZsVT8DXIsV3DSCLlnNSJO62w==` // window.$p
// const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtJPQXcV/Zi9XQ84Mu39i
// elugqfNfJeiA3yaKslu6pTw/QM/oSzZTwMGhBU2+uHrp08BgFY6vwZRq27EKwUOZ
// VR2YByoOq8+TAYXwOp38sJxTo2AcjbqB2VCFixPnJJQpGcAWLRp3DVMcxDRBxArv
// xoHc84vIRhzjDQMbzeZl+IuKfxjXb5v6fXrWreAbXPYzpcbYDTqHkXPw+8kFY7iK
// S26/otu+SRDBgnB2yaRaWNKxnjUOFh/QSvzFbQhxA//dxhUHGNsm32vYusdjzUeQ
// i4OCnyZN5AQROjFHzNXilsOJohTmeNLXEohg7By/YrUXbgKSKR/LmExtj6AzAARL
// UQIDAQAB`
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

  if (password === verification) return Promise.resolve()
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject()
}

export const logout = async () => {
  await store.dispatch('user/clearUserSession')
}
