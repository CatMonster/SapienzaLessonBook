'use strict'

import axios from 'axios'
import papaparse from 'papaparse'

export async function bookDetails() {
  const csv = await axios
    .get(process.env.CSV_URL)
    .then((res) => {
      return res.data
    })
    .catch((err) => console.log(err))

  const json = papaparse.parse(csv, {
    download: false,
    header: true,
  })

  return json
}
