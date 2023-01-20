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
  console.log('Generated language map', langMap)
  fs.writeFileSync(
    path.resolve(__dirname, '../src/lang.json'),
    JSON.stringify(langMap, null, 2),
    { charset: 'utf-8' }
  )

  // update ts definition
  const { LANGS } = require('../src/lang')
  const typingsTpl = fs.readFileSync(path.resolve(__dirname, './index.tpl.d.ts'), 'utf-8')
  fs.writeFileSync(
    path.resolve(__dirname, '../index.d.ts'),
    '// AUTO-GENERATED. SEE scripts/index.tpl.d.ts FOR ORIGINAL TYPINGS\n\n' +
    typingsTpl.replace(
      '__LANG_MAP__',
      JSON.stringify(LANGS, null, 4)
        .replace('}', `${' '.repeat(2)}}`)
        .replace(/"/g, '\'')
      ),
    { charset: 'utf-8' }
  )
})()
