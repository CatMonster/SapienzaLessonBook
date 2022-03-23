import axios from 'axios'
import papaparse from 'papaparse'

export default async function test() {
  const csv = await axios
    .get(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vS2x93VwlYU_82YYhE1Q-4XwrW1ZtRdVmmjyRMWU69wNoNnS-BoW25kqSymC5jeAkxwvegt40Hx7L7v/pub?gid=0&single=true&output=csv',
    )
    .then((res) => {
      console.log('file scaricato')
      return res.data
    })
    .catch((err) => console.log(err))

  const dataInJSON = papaparse.parse(csv, {
    download: false,
    header: true,
  })
  console.log(dataInJSON)
}
