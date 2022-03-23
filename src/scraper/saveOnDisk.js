import fs from 'fs'
import parser from './parser.js'

export default function saveOnDisk(data) {
  const basePath = 'src/scraper/_out'
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath)
  }

  const options = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }
  let now = new Date()
    .toLocaleString('it-IT', options)
    .replace(/(\/)/gm, '-')
    .replace(/(:)/gm, '.')
    .replace(' ', '_')
    .replace(',', '')

  fs.writeFileSync(`${basePath}/scrape-data-${now}.json`, JSON.stringify(data), 'utf-8')
  fs.writeFileSync(`${basePath}/scrape-data-${now}.csv`, parser(data), 'utf-8')
}
