/**
 * @type {import('got').Got}
 */
const got = require('got')
const cheerio = require('cheerio')
const fs = require('node:fs')
const path = require('node:path')

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0'

;(async () => {
  // fetch supported EPT languages
  const { body: eptBody } = await got('https://bing.com/translator?edgepdftranslator=1', {
    headers: {
      'Accept-Language': 'en-US,en',
      'User-Agent': DEFAULT_USER_AGENT
    }
  })
  let $ = cheerio.load(eptBody)
  const eptLangOptions = $('#t_tgtAllLang').children('option')
  const eptLangCodes = []
  for (let i = 0, len = eptLangOptions.length, option; i < len; i++) {
    option = $(eptLangOptions[i])
    eptLangCodes.push(option.attr('value'))
  }

  const parseRichTranslateParams = (body) => JSON.parse(
    body.match(/params_RichTranslate\s?=\s?([^;]+);/)[1].replace(/,]$/, ']')
  )

  const { body } = await got('https://bing.com/translator', {
    headers: {
      'Accept-Language': 'en-US,en',
      'User-Agent': DEFAULT_USER_AGENT
    }
  })

  // fetch config
  const richTranslateParams = parseRichTranslateParams(body)
  // EPT config
  const eptRichTranslateParams = parseRichTranslateParams(eptBody)

  const config = {
    websiteEndpoint: richTranslateParams[1],
    translateEndpoint: richTranslateParams[0],
    spellCheckEndpoint: richTranslateParams[29],
    // maxTextLen: richTranslateParams[5],
    // PENDING: hard-coding
    maxTextLen: 1000,
    // PENDING: hard-coding
    maxTextLenCN: 5000,
    maxCorrectableTextLen: richTranslateParams[26],
    maxEPTTextLen: eptRichTranslateParams[5],
    correctableLangs: richTranslateParams[27],
    eptLangs: eptLangCodes,
    userAgent: DEFAULT_USER_AGENT
  }
  fs.writeFileSync(
    path.resolve(__dirname, '../src/config.json'),
    JSON.stringify(config, null, 2),
    { charset: 'utf-8' }
  )
  console.log('✔️ Generated config\n', config)

  // fetch supported languages
  $ = cheerio.load(body)
  const langOptions = $('#t_tgtAllLang').children('option')
  const langMap = {}
  for (let i = 0, len = langOptions.length, option; i < len; i++) {
    option = $(langOptions[i])
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

  // Languages supported by MET mode (usually it's the same with bing translator)
  const { translation: metTranslationLanguages } = await got('https://api.cognitive.microsofttranslator.com/languages', {
    searchParams: {
      'api-version': '3.0',
      scope: 'translation'
    },
    headers: {
      'Accept-Language': 'en-US,en',
      'User-Agent': DEFAULT_USER_AGENT
    }
  }).json()
  const metLangMap = Object.entries(metTranslationLanguages)
    .reduce((langCodeMap, [langCode, langItem]) => (langCodeMap[langCode] = langItem.name, langCodeMap), {})
  fs.writeFileSync(
    path.resolve(__dirname, '../src/met/lang.json'),
    JSON.stringify(metLangMap, null, 2),
    { charset: 'utf-8' }
  )
  console.log()
  console.log('✔️ Generated language map (MET mode)\n', metLangMap)
  console.log()

  // update ts definition
  require('./generate-dts')
})()
