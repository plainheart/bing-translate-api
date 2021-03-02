const got = require('got')
const qs = require('qs')

const lang = require('./lang')

const TRANSLATE_API_ROOT = 'https://bing.com'
const TRANSLATE_WEBSITE = TRANSLATE_API_ROOT + '/translator'
const TRANSLATE_API = TRANSLATE_API_ROOT + '/ttranslatev3?isVertical=1'

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36'
const CONTENT_TYPE = 'application/x-www-form-urlencoded'

let globalConfig

/**
 * fetch global config including `IG` and `IID`
 * @param {string} userAgent
 */
async function fetchGlobalConfig(userAgent) {
  let IG
  let IID
  try {
    const { body } = await got(TRANSLATE_WEBSITE, {
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

function makeRequestURL(IG, IID, count) {
  return TRANSLATE_API
    + (IG && IG.length ? '&IG=' + IG : '')
    + (IID && IID.length ? '&IID=' + IID + '.' + count : '')
}

function makeRequestBody(text, fromLang, toLang) {
  return qs.stringify({
    fromLang,
    to: toLang,
    text
  })
}

/**
 * To translate
 *
 * @param {string} text content to be translated
 * @param {string} from source language code. `auto-detect` by default.
 * @param {string} to target language code. `en` by default.
 * @param {string} userAgent the expected user agent header
 */
async function translate(text, from, to, userAgent) {
  if (!text || !(text = text.trim())) {
    return
  }

  if (!globalConfig) {
    await fetchGlobalConfig(userAgent)
  }

  from = from || 'auto-detect'
  to = to || 'en'

  if (!lang.isSupported(from) || !lang.isSupported(to)) {
    throw new Error(`The language '${lang}' is not supported!`)
  }

  from = lang.getLangCode(from)
  to = lang.getLangCode(to)

  const requestURL = makeRequestURL(globalConfig.IG, globalConfig.IID, ++globalConfig.count)
  const requestBody = makeRequestBody(text, from, to === 'auto-detect' ? 'en' : to)

  const { body } = await got.post(requestURL, {
    headers: {
      'content-type': CONTENT_TYPE,
      'user-agent': userAgent || USER_AGENT,
      referer: TRANSLATE_WEBSITE,
    },
    body: requestBody,
    responseType: 'json'
  })

  return body
}

module.exports = {
  translate,
  lang
}
