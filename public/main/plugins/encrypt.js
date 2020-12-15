/*
 * @Author: Whzcorcd
 * @Date: 2020-12-08 13:28:42
 * @LastEditors: Whzcorcd
 * @LastEditTime: 2020-12-08 14:58:34
 * @Description: file content
 */
import JSEncrypt from 'jsencrypt/bin/jsencrypt'

export const encrypt = ({ value, pubKey }) => {
  const jsencrypt = new JSEncrypt()
  jsencrypt.setPublicKey(pubKey)
  return jsencrypt.encrypt(value)
}

export const decrypt = ({ cipherText, privateKey }) => {
  const jsdecrypt = new JSEncrypt()
  jsdecrypt.setPrivateKey(privateKey)
  return jsdecrypt.decrypt(cipherText)
}
