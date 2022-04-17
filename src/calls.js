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
  const { CODICE_FISCALE, LOGIN_USERNAME, DATA_NASCITA, COGNOME, NOME, EMAIL } = process.env
  const { dates, times, building, classroom, stringaData, codicesiram } = data

  const form = `__Click: C12585E7003519C8.c8e9f943d3b2819fc12587ed0064a0a2/$Body/2.9F0
  %%Surrogate_codiceedificio:1
  codiceedificio:${building}
  %%Surrogate_aula:1
  aula:${classroom}
  ${times}
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
  dataappo1:
  dataappo2:
  stringadata:${stringaData}
  prenotaappo:SI
  ${dates}
  codicesiram:${codicesiram}
  $$HTMLFrontMatter:<!DOCTYPE html>
  $$HTMLTagAttributes:lang="it"
  httpcookie:1
  matricola:${LOGIN_USERNAME}
  codicefiscale:${CODICE_FISCALE}
  datanasc:${DATA_NASCITA}
  cognome:${COGNOME}
  nome:${NOME}
  email:${EMAIL}
  controllomatr:${LOGIN_USERNAME}`

  return new Promise((resolve, reject) => {
    exec(
      `wget --no-check-certificate -O index.html \
        --method POST \
        --timeout=0 \
        --header 'Cookie: LtpaToken=${cookie}' \
        --body-data "${form.replaceAll('\n', ' ')}" \
        https://prodigit.uniroma1.it/prenotazioni/prenotaaule.nsf/prenotaposto-aula-lezioni?OpenForm&Seq=3#_RefreshKW_dichiarazione`,
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
