'use strict'

import fs from 'fs'

import { login, book } from './calls.js'
import { bookDetails } from './utils.js'

const main = async () => {
  const { LOGIN_USERNAME, LOGIN_PASSWORD } = process.env

  const cookie = await login(LOGIN_USERNAME, LOGIN_PASSWORD)
  console.log({ cookie })

  const { data } = await bookDetails()

  const lessonBlocks = data.length / 10
  for (let i = 1; i < lessonBlocks; i++) {
    // Array slicing is not inclusive for last element: https://stackoverflow.com/questions/3580239/javascript-array-get-range-of-items/3580255#3580255
    const lessons = data.slice((i - 1) * 10, i * 10)
    //                          1 - 1 * 10 = 0,   1 * 10 = 10
    //                          2 - 1 * 10 = 10,  2 * 10 = 20

    // data1:03/10/2022
    let dates = ''
    let stringaData = ''
    for (let d = 0; d < 10; d++) {
      dates += `data${d + 1}:${lessons[d].day}\n`
      stringaData += `${lessons[d].day}${d === 9 ? '' : '#'}`
    }

    const timeTemplate = (orario, start, end) => {
      return `
      %%Surrogate_dalleore${orario}:1
      dalleore${orario}:${start}
      %%Surrogate_alleore${orario}:1
      alleore${orario}:${end}\n
    `
    }

    lessons.forEach(async (lesson, i) => {
      const { day, start, end, building, classroom } = lesson

      if (start !== '' || end !== '' || building !== '' || classroom !== '') {
        let times = ''
        for (let t = 0; t < 10; t++) {
          if (day === lessons[t].day) {
            times += timeTemplate(t + 1, start, end)
          } else {
            times += timeTemplate(t + 1, '--:--', '--:--')
          }
        }

        const codicesiram = classroom.match(/(CU006[\s\S]*$)/)[0]

        const culo = await book(cookie, { dates, times, building, classroom, stringaData, codicesiram })
        fs.writeFileSync(`./culetti/culo${i}.txt`, culo, 'utf-8')
      }
    })
  }
}

main()
