const got = require('got')
const qs = require('qs')

const lang = require('./lang')

const TRANSLATE_API_ROOT = 'https://{tld}bing.com'
const TRANSLATE_WEBSITE = TRANSLATE_API_ROOT + '/translator'
const TRANSLATE_API = TRANSLATE_API_ROOT + '/ttranslatev3?isVertical=1\u0026'
const TRANSLATE_SPELL_CHECK_API = TRANSLATE_API_ROOT + '/tspellcheckv3?isVertical=1\u0026'

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
const CONTENT_TYPE = 'application/x-www-form-urlencoded'

// PENDING: fetch from `params_RichTranslate`?
const MAX_TEXT_LEN = 1000
// PENDING
const MAX_CORRECT_TEXT_LEN = 50

let globalConfig
let globalConfigPromise

function replaceTld(url, tld) {
  if (tld && (tld !== 'www' && tld !== 'cn')) {
    console.warn(`the tld '${tld}' may not be valid.`)
  }
  return url.replace('{tld}', tld ? tld + '.' : '')
}

/**
 * refetch global config if token is expired
 * @return {boolean} whether token is expired or not
 */
function isTokenExpired() {
  if (!globalConfig) {
    return true
  }
  const { tokenTs, tokenExpiryInterval } = globalConfig
  return Date.now() - tokenTs > tokenExpiryInterval
}

/**
 * fetch global config including `IG`, `IID`, `token`, `key`, `tokenTs`, `tokenExpiryInterval` and `cookie`
 * @param {string} tld www | cn | ''
 * @param {string} userAgent
 */
async function fetchGlobalConfig(tld, userAgent) {
  let IG
  let IID
  let token
  let key
  let tokenTs
  let tokenExpiryInterval
  let cookie
  try {
    const { body, headers } = await got(replaceTld(TRANSLATE_WEBSITE, tld), {
      headers: {
        'user-agent': userAgent || USER_AGENT
      }
    })

    // PENDING: optional?
    cookie = headers['set-cookie'].map(c => c.split(';')[0]).join('; ')

    IG = body.match(/IG:"([^"]+)"/)[1]
    IID = body.match(/data-iid="([^"]+)"/)[1]

    // required
    const [_key, _token, interval] = new Function(`return ${body.match(/params_RichTranslateHelper\s?=\s?([^\]]+\])/)[1]}`)()
    key = tokenTs = _key
    token = _token
    tokenExpiryInterval = interval
  } catch (e) {
    console.error('failed to fetch global config', e)
    throw e
  }
  return globalConfig = {
    IG,
    IID,
    key,
    token,
    tokenTs,
    tokenExpiryInterval,
    cookie,
    // PENDING: reset count if count value is large?
    count: 0
  }
}

function makeRequestURL(isSpellCheck, IG, IID, count, tld) {
  return replaceTld(isSpellCheck ? TRANSLATE_SPELL_CHECK_API : TRANSLATE_API, tld)
    + (IG && IG.length ? '&IG=' + IG : '')
    + (IID && IID.length ? '&IID=' + IID + '.' + count : '')
}

function makeRequestBody(isSpellCheck, text, fromLang, toLang, token, key) {
  const body = {
    fromLang,
    text,
    token,
    key
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

  if (text.length > MAX_TEXT_LEN) {
    throw new Error(`The supported maximum length of text is ${MAX_TEXT_LEN}. Please shorten the text.`)
  }

  if (!globalConfigPromise) {
    globalConfigPromise = fetchGlobalConfig(tld, userAgent)
  }

  await globalConfigPromise

  if (isTokenExpired()) {
    globalConfigPromise = fetchGlobalConfig(tld, userAgent)

    await globalConfigPromise
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
  const requestBody = makeRequestBody(false, text, from, to === 'auto-detect' ? 'en' : to, globalConfig.token, globalConfig.key)

  const requestHeaders = {
    'content-type': CONTENT_TYPE,
    'user-agent': userAgent || USER_AGENT,
    referer: replaceTld(TRANSLATE_WEBSITE, tld),
    cookie: globalConfig.cookie
  }

  const { body } = await got.post(requestURL, {
    headers: requestHeaders,
    body: requestBody,
    responseType: 'json'
  })

  if (body.ShowCaptcha) {
    throw new Error(`
      Sorry that bing translator seems to be asking for the captcha,
      Please take care not to request too frequently.
      The response code is ${body.StatusCode}.
    `)
  }

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
    const correctLang = detectedLang.language
    const matcher = text.match(/"/g)
    const len = text.length + (matcher && matcher.length || 0)
    // currently, there is a limit of 50 characters for correction service
    // and only parts of languages are supported
    // otherwise, it will return status code 400
    if (len <= MAX_CORRECT_TEXT_LEN && lang.canCorrect(correctLang)) {
      const requestURL = makeRequestURL(true, globalConfig.IG, globalConfig.IID, ++globalConfig.count, tld)
      const requestBody = makeRequestBody(true, text, correctLang, null, globalConfig.token, globalConfig.key)

      const { body } = await got.post(requestURL, {
        headers: requestHeaders,
        body: requestBody,
        responseType: 'json'
      })

      res.correctedText = body && body.correctedText
    }
    else {
      console.warn(`The detected language '${correctLang}' is not supported to be corrected or the length of text is more than ${MAX_CORRECT_TEXT_LEN}.`)
    }
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
