const got = require('got')
const cheerio = require('cheerio')
const fs = require('node:fs')
const path = require('node:path')

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'

;(async () => {
  const { body } = await got('https://bing.com/translator', {
    headers: {
      'Accept-Language': 'en-US,en'
    }
  })

  // fetch config
  const richTranslateParams = JSON.parse(
    body.match(/params_RichTranslate\s?=\s?([^;]+);/)[1]
  )
  const config = {
    websiteEndpoint: richTranslateParams[1],
    translateEndpoint: richTranslateParams[0],
    spellCheckEndpoint: richTranslateParams[33],
    maxTextLen: richTranslateParams[5],
    maxCorrectableTextLen: richTranslateParams[30],
    correctableLangs: richTranslateParams[31],
    userAgent: DEFAULT_USER_AGENT
  }
  fs.writeFileSync(
    path.resolve(__dirname, '../src/config.json'),
    JSON.stringify(config, null, 2),
    { charset: 'utf-8' }
  )
  console.log('✔️ Generated config\n', config)

  // fetch supported languages
  const $ = cheerio.load(body)
  const options = $('#t_tgtAllLang').children('option')
  const langMap = {}
  for (let i = 0, len = options.length, option; i < len; i++) {
    option = $(options[i])
    langMap[option.attr('value')] = option.text().trim()
  }
  fs.writeFileSync(
    path.resolve(__dirname, '../src/lang.json'),
    JSON.stringify(langMap, null, 2),
    { charset: 'utf-8' }
  )
  console.log()
  console.log('✔️ Generated language map\n', langMap)
  console.log()

  // update ts definition
  require('./generate-dts')

  console.log()

  // generate README
  require('./generate-readme')
})()
