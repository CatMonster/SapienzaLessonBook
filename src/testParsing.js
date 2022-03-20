import csvToJson from 'csv-file-to-json'
import axios from 'axios'

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
  const dataInJSON = csvToJson({
    data: csv,
    hasHeaders: false,
    headers: [
      'NOME GIORNO',
      'GIORNO',
      'LEZIONE 1 DALLE',
      'LEZIONE 1 ALLE',
      'LEZIONE 1 EDIFICIO',
      'LEZIONE 1 AULA',
      'LEZIONE 2 DALLE',
      'LEZIONE 2 ALLE',
      'LEZIONE 2 EDIFICIO',
      'LEZIONE 2 AULA',
    ],
  })

  console.log(dataInJSON)
}
