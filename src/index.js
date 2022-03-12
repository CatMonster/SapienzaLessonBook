'use strict'

import { login, book } from './calls.js'

const main = async () => {
  const { LOGIN_USERNAME, LOGIN_PASSWORD } = process.env

  const cookie = await login(LOGIN_USERNAME, LOGIN_PASSWORD)
  console.log(cookie)
  await book(cookie)
}

main()
