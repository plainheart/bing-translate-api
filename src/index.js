const got = require('got')
const qs = require('qs')

const lang = require('./lang')

const TRANSLATE_API_ROOT = 'https://{tld}bing.com'
const TRANSLATE_WEBSITE = TRANSLATE_API_ROOT + '/translator'
const TRANSLATE_API = TRANSLATE_API_ROOT + '/ttranslatev3?isVertical=1'
const TRANSLATE_SPELL_CHECK_API = TRANSLATE_API_ROOT + '/tspellcheckv3?isVertical=1'

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'
const CONTENT_TYPE = 'application/x-www-form-urlencoded'

let globalConfig

function replaceTld(url, tld) {
  if (tld && (tld !== 'www' && tld !== 'cn')) {
    console.warn(`the tld '${tld}' may not be valid.`)
  }
  return url.replace('{tld}', tld ? tld + '.' : '')
}

/**
 * fetch global config including `IG` and `IID`
 * @param {string} tld www | cn | ''
 * @param {string} userAgent
 */
async function fetchGlobalConfig(tld, userAgent) {
  let IG
  let IID
  try {
    const { body } = await got(replaceTld(TRANSLATE_WEBSITE, tld), {
      headers: {
        'user-agent': userAgent || USER_AGENT
      }
    })
    IG = body.match(/IG:"([^"]+)"/)[1]
    IID = body.match(/data-iid="([^"]+)"/)[1]
  } catch (e) {
    console.error('failed to fetch IG and IID', e)
  }
  return globalConfig = {
    IG,
    IID,
    count: 0
  }
}

function makeRequestURL(isSpellCheck, IG, IID, count, tld) {
  return replaceTld(isSpellCheck ? TRANSLATE_SPELL_CHECK_API : TRANSLATE_API, tld)
    + (IG && IG.length ? '&IG=' + IG : '')
    + (IID && IID.length ? '&IID=' + IID + '.' + count : '')
}

function makeRequestBody(isSpellCheck, text, fromLang, toLang) {
  const body = {
    fromLang,
    text
  }
  if (!isSpellCheck) {
    body.to = toLang
  }
  return qs.stringify(body)
}

/**
 * To translate
 *
 * @param {string} text content to be translated
 * @param {string} from <optional> source language code. `auto-detect` by default.
 * @param {string} to <optional> target language code. `en` by default.
 * @param {boolean} correct <optional> whether to correct the input text. `false` by default.
 * @param {boolean} raw <optional> the result contains raw response if `true`
 * @param {string} tld <optional> www | cn | ''
 * @param {string} userAgent <optional> the expected user agent header
 */
async function translate(text, from, to, correct, raw, tld, userAgent) {
  if (!text || !(text = text.trim())) {
    return
  }

  if (!globalConfig) {
    await fetchGlobalConfig(tld, userAgent)
  }

  from = from || 'auto-detect'
  to = to || 'en'

  const fromSupported = lang.isSupported(from)
  const toSupported = lang.isSupported(to)

  if (!fromSupported || !toSupported) {
    throw new Error(`The language '${!fromSupported ? from : !toSupported ? to : ''}' is not supported!`)
  }

  from = lang.getLangCode(from)
  to = lang.getLangCode(to)

  const requestURL = makeRequestURL(false, globalConfig.IG, globalConfig.IID, ++globalConfig.count, tld)
  const requestBody = makeRequestBody(false, text, from, to === 'auto-detect' ? 'en' : to)

  const requestHeaders = {
    'content-type': CONTENT_TYPE,
    'user-agent': userAgent || USER_AGENT,
    referer: TRANSLATE_WEBSITE,
  }

  const { body } = await got.post(requestURL, {
    headers: requestHeaders,
    body: requestBody,
    responseType: 'json'
  })

  const translation = body[0].translations[0]
  const detectedLang = body[0].detectedLanguage

  const res = {
    text,
    userLang: from,
    translation: translation.text,
    language: {
      from: detectedLang.language,
      to: translation.to,
      score: detectedLang.score
    }
  }

  if (correct) {
    const requestURL = makeRequestURL(true, globalConfig.IG, globalConfig.IID, ++globalConfig.count, tld)
    const requestBody = makeRequestBody(true, text, detectedLang.language)

    const { body } = await got.post(requestURL, {
      headers: requestHeaders,
      body: requestBody,
      responseType: 'json'
    })

    res.correctedText = body && body.correctedText
  }

  if (raw) {
    res.raw = body
  }

  return res
}

module.exports = {
  translate,
  lang
}
