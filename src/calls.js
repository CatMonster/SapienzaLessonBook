'use strict'

import { exec } from 'child_process'

export function login(username, password) {
  return new Promise((resolve, reject) => {
    exec(
      `wget --no-check-certificate -d -q --delete-after \
      --method POST \
      --timeout=0 \
      --header '' \
      --body-data 'Username=${username}&Password=${password}' \
      'https://prodigit.uniroma1.it/names.nsf?Login'
      `,
      function (error, stdout, stderr) {
        try {
          const cookie = stderr.match(/Set-Cookie: LtpaToken=([^;]*);/)[1]
          resolve(cookie)
        } catch (e) {
          reject(e)
        }
      },
    )
  })
}

export function book(cookie, data) {
  const { codiceedificio, aula } = data
  // codiceedificio: CU003
  // aula: AULA A - EX ISO -- CU003-E01P02L075

  const orariPrenotazione = ''

  // {
  //   giorno: "lunedi",
  //   dalle: "10:00",
  //   alle: "12:00"
  // }

  for (let i = 0; i < 10; i++) {
    // const orario = i + 1
    //   const { dalle, alle } = timetable
    //   orariPrenotazione += `
    //     %%Surrogate_dalleore${orario}:1
    //     dalleore${orario}:08:00
    //     %%Surrogate_alleore${orario}:1
    //     alleore${orario}:09:00
    //   `
  }

  // %%Surrogate_dalleore1:1
  // dalleore1:08:00
  // %%Surrogate_alleore1:1
  // alleore1:09:00
  // %%Surrogate_dalleore2:1
  // dalleore2:10:00
  // %%Surrogate_alleore2:1
  // alleore2:11:00
  // %%Surrogate_dalleore3:1
  // dalleore3:1:00
  // %%Surrogate_alleore3:1
  // alleore3:10:00
  // %%Surrogate_dalleore4:1
  // dalleore4:--:--
  // %%Surrogate_alleore4:1
  // alleore4:--:--
  // %%Surrogate_dalleore5:1
  // dalleore5:--:--
  // %%Surrogate_alleore5:1
  // alleore5:--:--
  // %%Surrogate_dalleore6:1
  // dalleore6:--:--
  // %%Surrogate_alleore6:1
  // alleore6:--:--
  // %%Surrogate_dalleore7:1
  // dalleore7:--:--
  // %%Surrogate_alleore7:1
  // alleore7:--:--
  // %%Surrogate_dalleore8:1
  // dalleore8:--:--
  // %%Surrogate_alleore8:1
  // alleore8:--:--
  // %%Surrogate_dalleore9:1
  // dalleore9:--:--
  // %%Surrogate_alleore9:1
  // alleore9:--:--
  // %%Surrogate_dalleore10:1
  // dalleore10:--:--
  // %%Surrogate_alleore10:1
  // alleore10:--:--

  const form = `__Click:C12585E7003519C8.c8e9f943d3b2819fc12587ed0064a0a2/$Body/2.2
  %%Surrogate_codiceedificio:1
  codiceedificio:${codiceedificio}
  %%Surrogate_aula:1
  aula:${aula}
  ${orariPrenotazione}
  %%Surrogate_dichiarazione:1
  dichiarazione::
  database:prenotazioni/prenotaaule.nsf
  ruolodomino:$$WebClient
  form:prenotaposto-in-aula
  ruolo:studente
  cancella:
  recorddeleted:
  SaveOptions:0
  numerobadge:
  corsodistudio:
  codicecorso:
  facolta:
  nuovo_documento:0
  fila:
  posto:
  seriale:
  webdb:/prenotazioni/prenotaaule.nsf/
  Message:
  cancellato:NO
  flag:0
  controllomatricole:
  numerosettimane:
  appo:
  directoryaule:prenotazioni/prenotaaule.nsf
  directory:prenotazioni
  servername:prodigit.uniroma1.it
  appo22:
  systemreaders:[admin]
  dataappo1:11/18/2021
  dataappo2:11/18/2021
  prenotaappo:SI
  data1:03/10/2022
  data2:03/11/2022
  data3:03/12/2022
  data4:03/14/2022
  data5:03/15/2022
  data6:03/16/2022
  data7:03/17/2022
  data8:03/18/2022
  data9:03/19/2022
  data10:03/21/2022
  $$HTMLFrontMatter:<!DOCTYPE html>
  $$HTMLTagAttributes:lang="it"
  httpcookie:1`

  return new Promise((resolve, reject) => {
    exec(
      `wget --no-check-certificate -O index.html \
        --method POST \
        --timeout=0 \
        --header 'Cookie: LtpaToken=${cookie}' \
        --body-data ${form}`,
      (error, stdout, stderr) => {
        try {
          console.log('error', error)
          console.log('stdout', stdout)
          console.log('stderr', stderr)

          resolve('ok')
        } catch (e) {
          reject(e)
        }
      },
    )
  })
}
