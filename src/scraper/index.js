'use strict'

import puppeteer from 'puppeteer'

export default async function scrape() {
  const { DEBUG, PAGE_W, PAGE_H, CHROME_PATH, PROFILE_PATH } = process.env

  // Init chromium instance
  const browser = await puppeteer.launch({
    headless: Boolean(!DEBUG),
    args: [`--window-size=${PAGE_W},${PAGE_H}`],
    executablePath: CHROME_PATH,
    userDataDir: PROFILE_PATH,
  })
  const page = await browser.newPage()
  await page.setViewport({ width: parseInt(PAGE_W), height: parseInt(PAGE_H) })

  // -------------------------
  // NSFW things start here 😏
  // -------------------------

  await login(page)
  const scrapedData = await scrapeAule(page)

  console.log(scrapedData)

  // page.close()
}

const login = async (page) => {
  const { LOGIN_USERNAME, LOGIN_PASSWORD } = process.env

  await page.goto('https://prodigit.uniroma1.it/names.nsf?Login')

  await page.type('input[name="Username"]', LOGIN_USERNAME)
  await page.type('input[name="Password"]', LOGIN_PASSWORD)
  await page.$eval('input[type="submit"]', (el) => el.click())
}

const scrapeAule = async (page) => {
  await page.goto('https://prodigit.uniroma1.it/prenotazioni/prenotaaule.nsf/prenotaposto-aula-lezioni', {
    waitUntil: 'load',
  })

  const edifici = await page.$$('#codiceedificio option')
  const data = []

  for (let i = 1; i < edifici.length; i++) {
    const edificio = edifici[i]
    const edificioName = await edificio
      .evaluate((el) => el.innerText)
      .then((value) => value.replace(/(\r\n|\n|\r)/gm, ''))

    const aule = await loadAule(page, edificio)

    data.push({
      edificioName,
      aule,
    })
  }

  return data
}

const loadAule = async (page, edificioOption) => {
  // Selecting option via js, this website is a shit,
  // they are not closing option tags and not using any values,
  // so using the hand way

  const edificioName = await edificioOption
    .evaluate((el) => el.innerText)
    .then((value) => value.replace(/(\r\n|\n|\r)/gm, ''))

  // Injecting 'selected' attribute to current option
  await edificioOption.evaluate((el) => el.setAttribute('selected', ''))
  // Tricking their function to load values in their stupid backend
  // eslint-disable-next-line no-undef
  await edificioOption.evaluate(() => _doClick('$Refresh', this, '_self', '#_RefreshKW_codiceedificio'))

  await page.waitForSelector('select[name="aula"]', { timeout: 1000 })

  const rawAule = await page.$$("select[name='aula'] option")
  console.log(`Edificio - ${edificioName}: ${rawAule.length} ${rawAule.length > 1 ? 'aule' : 'aula'} found`)

  const temp = []
  // 'i' starts from 1 to avoid empty select value
  for (let i = 1; i < rawAule.length; i++) {
    const aula = await rawAule[i].evaluate((el) => el.innerText).then((value) => value.replace(/(\r\n|\n|\r)/gm, ''))
    temp.push(aula)
  }

  return temp
}
