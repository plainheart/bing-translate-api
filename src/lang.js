/**
 * Generated from https://bing.com/translator
 */
const LANGS = {
  'auto-detect': 'Auto-detect',
  ...require('./lang.json')
}

const LANGS_CORRECTABLE = [
  'da',
  'en',
  'nl',
  'fi',
  'fr',
  'fr-CA',
  'de',
  'it',
  'ja',
  'ko',
  'no',
  'pl',
  'pt',
  'pt-PT',
  'ru',
  'es',
  'sv',
  'tr',
  'zh-Hant',
  'zh-Hans'
]

/**
 * @param {string} lang
 */
function getLangCode(lang) {
  if (!lang || typeof lang !== 'string') {
    return
  }

  if (LANGS[lang]) {
    return lang
  }

  lang = lang.toLowerCase()

  const supportedLangCodes = Object.keys(LANGS)

  for (let i = 0, len = supportedLangCodes.length, code; i < len; i++) {
    code = supportedLangCodes[i]
    if (code.toLowerCase() === lang || LANGS[code].toLowerCase() === lang) {
      return code
    }
  }
}

/**
 * @param {string} lang
 */
function isSupported(lang) {
  return !!getLangCode(lang)
}

/**
 * @param {string} lang
 */
function isCorrectable(lang) {
  return LANGS_CORRECTABLE.includes(getLangCode(lang))
}

module.exports = {
  LANGS,
  getLangCode,
  isSupported,
  isCorrectable
}
