/**
 * Generated from https://api.cognitive.microsofttranslator.com/languages
 */
const LANGS = require('./lang.json')

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

module.exports = {
  LANGS,
  getLangCode,
  isSupported
}
