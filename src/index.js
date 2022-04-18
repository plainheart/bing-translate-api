const got = require('got')

const lang = require('./lang')

const TRANSLATE_API_ROOT = 'https://{tld}bing.com'
const TRANSLATE_WEBSITE = TRANSLATE_API_ROOT + '/translator'
const TRANSLATE_API = TRANSLATE_API_ROOT + '/ttranslatev3'
const TRANSLATE_SPELL_CHECK_API = TRANSLATE_API_ROOT + '/tspellcheckv3'

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36'

// PENDING: fetch from `params_RichTranslate`?
const MAX_TEXT_LEN = 1000
// PENDING
const MAX_CORRECT_TEXT_LEN = 50

let globalConfig
let globalConfigPromise

function replaceTld(url, tld) {
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
 * @param {string} userAgent
 * @param {import('got').Agents} proxyAgents
 */
async function fetchGlobalConfig(userAgent, proxyAgents) {
  let tld
  let IG
  let IID
  let token
  let key
  let tokenExpiryInterval
  let isVertical
  let frontDoorBotClassification
  let isSignedInOrCorporateUser
  let cookie
  try {
    const { body, headers, request: { redirects } } = await got(replaceTld(TRANSLATE_WEBSITE, tld), {
      headers: {
        'user-agent': userAgent || USER_AGENT
      },
      agent: proxyAgents
    })

    tld = redirects[0].match(/^https?:\/\/(\w+)\.bing\.com/)[1]

    // PENDING: optional?
    cookie = headers['set-cookie'].map(c => c.split(';')[0]).join('; ')

    IG = body.match(/IG:"([^"]+)"/)[1]
    IID = body.match(/data-iid="([^"]+)"/)[1]

    // required
    ;[key, token, tokenExpiryInterval, isVertical, frontDoorBotClassification, isSignedInOrCorporateUser] = JSON.parse(
      body.match(/params_RichTranslateHelper\s?=\s?([^\]]+\])/)[1]
    )
  } catch (e) {
    console.error('failed to fetch global config', e)
    throw e
  }
  return globalConfig = {
    tld,
    IG,
    IID,
    key,
    token,
    tokenTs: key,
    tokenExpiryInterval,
    isVertical,
    frontDoorBotClassification,
    isSignedInOrCorporateUser,
    cookie,
    // PENDING: reset count if count value is large?
    count: 0
  }
}

function makeRequestURL(isSpellCheck) {
  const { IG, IID, tld, isVertical } = globalConfig
  return replaceTld(isSpellCheck ? TRANSLATE_SPELL_CHECK_API : TRANSLATE_API, tld)
    + '?isVertical=' + +isVertical
    + (IG && IG.length ? '&IG=' + IG : '')
    + (IID && IID.length ? '&IID=' + IID + '.' + (globalConfig.count++) : '')
}

function makeRequestBody(isSpellCheck, text, fromLang, toLang) {
  const { token, key } = globalConfig
  const body = {
    fromLang,
    text,
    token,
    key
  }
  if (!isSpellCheck && toLang) {
    body.to = toLang
  }
  return body
}

/**
 * To translate
 *
 * @param {string} text content to be translated
 * @param {string} from <optional> source language code. `auto-detect` by default.
 * @param {string} to <optional> target language code. `en` by default.
 * @param {boolean} correct <optional> whether to correct the input text. `false` by default.
 * @param {boolean} raw <optional> the result contains raw response if `true`
 * @param {string} userAgent <optional> the expected user agent header
 * @param {import('got').Agents} proxyAgents <optional> set agents of `got` for proxy
 */
async function translate(text, from, to, correct, raw, userAgent, proxyAgents) {
  if (!text || !(text = text.trim())) {
    return
  }

  if (text.length > MAX_TEXT_LEN) {
    throw new Error(`The supported maximum length of text is ${MAX_TEXT_LEN}. Please shorten the text.`)
  }

  if (!globalConfigPromise) {
    globalConfigPromise = fetchGlobalConfig(userAgent, proxyAgents)
  }

  await globalConfigPromise

  if (isTokenExpired()) {
    globalConfigPromise = fetchGlobalConfig(userAgent, proxyAgents)

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

  const requestURL = makeRequestURL(false)
  const requestBody = makeRequestBody(false, text, from, to === 'auto-detect' ? 'en' : to)

  const requestHeaders = {
    'user-agent': userAgent || USER_AGENT,
    referer: replaceTld(TRANSLATE_WEBSITE, globalConfig.tld),
    cookie: globalConfig.cookie
  }

  const { body } = await got.post(requestURL, {
    headers: requestHeaders,
    // got will set CONTENT_TYPE as `application/x-www-form-urlencoded`
    form: requestBody,
    responseType: 'json',
    agent: proxyAgents
  })

  if (body.ShowCaptcha) {
    throw new Error(`
      Sorry that bing translator seems to be asking for the captcha,
      Please take care not to request too frequently.
      The response code is ${body.StatusCode}.
    `)
  }

  if (body.StatusCode === 401) {
    throw new Error(`
      Max count of translation exceeded. Please try it again later.
      The response code is 401.
    `)
  }

  if (body.statusCode) {
    throw new Error(`Something went wrong! The response is ${JSON.stringify(body)}.`)
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
      const requestURL = makeRequestURL(true)
      const requestBody = makeRequestBody(true, text, correctLang)

      const { body } = await got.post(requestURL, {
        headers: requestHeaders,
        form: requestBody,
        responseType: 'json',
        agent: proxyAgents
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
