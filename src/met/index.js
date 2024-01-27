/**
 * @typedef {{
 *  token: string,
 *  tokenExpiresAt: number
 * }} GlobalConfig
 *
 * @typedef {import('got').Got} Got
 * @typedef {import('got').Options} GotOptions
 *
 * @typedef {import('../../index').MET.MetTranslateOptions} TranslateOptions
 * @typedef {import('../../index').MET.MetTranslationResult} TranslationResult
 */

/** @type {Got} */
const got = require('got')

const lang = require('./lang')
const { userAgent: DEFAULT_USER_AGENT } = require('../config.json')

const API_AUTH = 'https://edge.microsoft.com/translate/auth'
const API_TRANSLATE = 'https://api.cognitive.microsofttranslator.com/translate'

/**
 * @type {GlobalConfig | undefined}
 */
let globalConfig
/**
 * @type {Promise<GlobalConfig> | undefined}
 */
let globalConfigPromise

/**
 * @param {string} [userAgent]
 */
async function fetchGlobalConfig(userAgent) {
  try {
    const authJWT = await got(API_AUTH, {
      headers: {
        'User-Agent': userAgent || DEFAULT_USER_AGENT
      }
    }).text()
    const jwtPayload = JSON.parse(Buffer.from(authJWT.split('.')[1], 'base64').toString('utf-8'))
    globalConfig = {
      token: authJWT,
      // valid in 10 minutes
      tokenExpiresAt: jwtPayload.exp * 1e3
    }
  } catch (e) {
    console.error('failed to fetch auth token')
    throw e
  }
}

function isTokenExpired() {
  // consider the token as expired if the rest time is less than 1 minute
  return !globalConfig || (globalConfig.tokenExpiresAt || 0) - Date.now() < 6e4
}

/**
 * To translate
 *
 * @param {string | string[]} text content to be translated
 * @param {string} [from] source language code
 * @param {string | string[]} to target language code(s). `en` by default.
 * @param {TranslateOptions} [options] optional translate options
 *
 * @returns {Promise<TranslationResult | undefined>}
 */
async function translate(text, from, to, options) {
  if (!text || !text.length) {
    return
  }

  // compatible with the bing translator
  from && from.toLocaleLowerCase() === 'auto-detect' && (from = void 0)
  from = lang.getLangCode(from)

  // target language fallbacks to `en`
  Array.isArray(to) || (to = [to])
  to = to.map(toLang => lang.getLangCode(toLang) || 'en')
  to.length || (to = ['en'])

  // check if the source and target languages are supported
  const fromSupported = !from || lang.isSupported(from)
  const toSupported = to.every(lang.isSupported)

  if (!fromSupported || !toSupported) {
    throw new Error(`Unsupported language(s): ${!fromSupported
      ? `'${from}'`
      : !toSupported ? to.map(t => `'${t}'`).join(', ') : ''
    }`)
  }

  // The MET mode no longer pre-checks the text length for simplicity
  Array.isArray(text) || (text = [text])

  options ||= {}

  // Skip to fetch the free authorization if the `authenticationHeaders` is provided
  // You will have to check if the authorization is expired by yourself
  // See https://learn.microsoft.com/azure/ai-services/translator/reference/v3-0-reference#authentication
  const authenticationHeaders = options.authenticationHeaders
  if (!authenticationHeaders) {
    if (!globalConfigPromise) {
      globalConfigPromise = fetchGlobalConfig(options.userAgent)
    }

    await globalConfigPromise

    if (isTokenExpired()) {
      globalConfigPromise = fetchGlobalConfig(options.userAgent)

      await globalConfigPromise
    }
  }

  const gotOptions = Object.assign({}, options.gotOptions)

  // for customized headers
  const gotHeaders = gotOptions.headers || {}
  delete gotOptions.headers

  const requestPayload = text.map(txt => ({ Text: txt }))

  try {
    const { body } = await got.post(API_TRANSLATE, {
      searchParams: new URLSearchParams([
        ...to.map(toLang => ['to', toLang]),
        ...Object.entries({
          'api-version': '3.0',
          from,
          // See https://learn.microsoft.com/azure/ai-services/translator/reference/v3-0-translate#optional-parameters
          ...(options.translateOptions || {})
        }).filter(([_, val]) => val != null && val !== '')
      ]),
      json: requestPayload,
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
        Authorization: authenticationHeaders ? void 0 : 'Bearer ' + globalConfig.token,
        ...(authenticationHeaders || {}),
        ...gotHeaders
      },
      responseType: 'json',
      // the customized `got` options
      ...gotOptions
    })
    return body
  } catch (e) {
    let errMsg
    if (e instanceof got.RequestError) {
      const response = e.response
      const responseBody = JSON.stringify(response.body, null, 2)
      errMsg = ` with a status code: ${response.statusCode} (${response.statusMessage})\n${responseBody}\n`
    } else {
      errMsg = `: ${e.message}`
    }
    throw new Error(`failed to translate${errMsg}`)
  }
}

module.exports = {
  translate,
  lang
}
