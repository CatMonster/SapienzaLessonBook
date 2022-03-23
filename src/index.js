'use strict'

import { login, book } from './calls.js'
import { bookDetails } from './utils.js'

const main = async () => {
  const { LOGIN_USERNAME, LOGIN_PASSWORD } = process.env

  const cookie = await login(LOGIN_USERNAME, LOGIN_PASSWORD)
  console.log({ cookie })

  const settings = await bookDetails()
  console.log(settings)
  await book(cookie, settings)
}

main()
