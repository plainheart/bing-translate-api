const got = require('got')
const cheerio = require('cheerio')
const fs = require('node:fs')
const path = require('node:path')

;(async () => {
  const { body } = await got('https://bing.com/translator', {
    headers: {
      'Accept-Language': 'en-US,en'
    }
  })
  const $ = cheerio.load(body)
  const options = $('#t_tgtAllLang').children('option')
  const langMap = {}
  for (let i = 0, len = options.length, option; i < len; i++) {
    option = $(options[i])
    langMap[option.attr('value')] = option.text().trim()
  }
  console.log('✔️ Generated language map', langMap)
  fs.writeFileSync(
    path.resolve(__dirname, '../src/lang.json'),
    JSON.stringify(langMap, null, 2),
    { charset: 'utf-8' }
  )

  // update ts definition
  require('./generate-dts')
})()
