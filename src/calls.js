'use strict'

import { exec } from 'child_process'
import fs from 'fs'

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
  const { CODICE_FISCALE, LOGIN_USERNAME, DATA_NASCITA, COGNOME, NOME, EMAIL } = process.env
  const { id, dates, times, building, classroom, stringaData, codicesiram } = data

  let form = `__Click=C12585E7003519C8.c8e9f943d3b2819fc12587ed0064a0a2/$Body/2.9F0
  %%Surrogate_codiceedificio=1
  codiceedificio=${building}
  %%Surrogate_aula=1
  ${times}
  %%Surrogate_dichiarazione=1
  dichiarazione=
  database=prenotazioni/prenotaaule.nsf
  ruolodomino=$$WebClient
  form=prenotaposto-in-aula
  ruolo=studente
  cancella=
  recorddeleted=
  SaveOptions=0
  numerobadge=
  corsodistudio=
  codicecorso=
  facolta=
  nuovo_documento=0
  fila=
  posto=
  seriale=
  webdb=/prenotazioni/prenotaaule.nsf/
  Message=
  cancellato=NO
  flag=0
  controllomatricole=
  numerosettimane=
  appo=
  directoryaule=prenotazioni/prenotaaule.nsf
  directory=prenotazioni
  servername=prodigit.uniroma1.it
  appo22=
  systemreaders=[admin]
  dataappo1=
  dataappo2=
  stringadata=${stringaData}
  prenotaappo=SI
  ${dates}
  codicesiram=${codicesiram}
  $$HTMLFrontMatter=<!DOCTYPE html>
  $$HTMLTagAttributes=lang="it"
  httpcookie=1
  matricola=${LOGIN_USERNAME}
  codicefiscale=${CODICE_FISCALE}
  datanasc=${DATA_NASCITA}
  cognome=${COGNOME}
  nome=${NOME}
  email=${EMAIL}
  controllomatr=${LOGIN_USERNAME}`

  form = form.replaceAll('\n', '&').replaceAll(' ', '').replaceAll('&&&', '&').replaceAll('&&', '&')
  form += `aula=${classroom}`

  fs.writeFileSync(
    'form.txt',
    `wget --no-check-certificate -O book_${id}.html \\
  --method POST \\
  --timeout=0 \\
  --header 'Cookie: destAula=${classroom}; LtpaToken=${cookie}' \\
  --body-data '${form}' \\
  'https://prodigit.uniroma1.it/prenotazioni/prenotaaule.nsf/prenotaposto-aula-lezioni?OpenForm&Seq=5'`,
  )

  return new Promise((resolve, reject) => {
    exec(
      `wget --no-check-certificate -O book_${id}.html \\
  --method POST \\
  --timeout=0 \\
  --header 'Cookie: destAula=${classroom}; LtpaToken=${cookie}' \\
  --body-data '${form}' \\
  'https://prodigit.uniroma1.it/prenotazioni/prenotaaule.nsf/prenotaposto-aula-lezioni?OpenForm&Seq=5'`,
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
