/**
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

// Free Edge endpoint: no auth. See https://www.ankio.net/research/technology/microsoft-edge-translate-api
const API_EDGE_TRANSLATE = 'https://edge.microsoft.com/translate/translatetext'
// Paid Azure Translator (only when authenticationHeaders is provided)
const API_AZURE_TRANSLATE = 'https://api.cognitive.microsofttranslator.com/translate'

// Elements with class containing "notranslate" must stay untouched in HTML mode.
const NOTRANSLATE_RE = /<([a-zA-Z][\w:-]*)((?:\s[^>]*)?\sclass\s*=\s*(["'])(?:(?!\3).)*\bnotranslate\b(?:(?!\3).)*\3[^>]*)>([\s\S]*?)<\/\1\s*>/gi
const PLACEHOLDER_RE = /\[\[NT(\d+)\]\]/g

/**
 * @param {string} html
 * @returns {{ masked: string, parts: string[] }}
 */
function maskNoTranslate(html) {
  const parts = []
  const masked = html.replace(NOTRANSLATE_RE, (match) => {
    const key = `[[NT${parts.length}]]`
    parts.push(match)
    return key
  })
  return { masked, parts }
}

/**
 * @param {string} html
 * @param {string[]} parts
 */
function unmaskNoTranslate(html, parts) {
  return html.replace(PLACEHOLDER_RE, (_, i) => parts[Number(i)])
}

/**
 * @param {string[]} text
 * @param {string | undefined} from
 * @param {string[]} to
 * @param {TranslateOptions} options
 * @returns {Promise<TranslationResult[]>}
 */
async function translateViaEdge(text, from, to, options) {
  const gotOptions = Object.assign({}, options.gotOptions)
  const gotHeaders = gotOptions.headers || {}
  delete gotOptions.headers

  const isHtml = options.translateOptions && options.translateOptions.textType === 'html'
  const masks = isHtml ? text.map(maskNoTranslate) : null
  const payload = masks ? masks.map(m => m.masked) : text

  const headers = {
    'User-Agent': options.userAgent || DEFAULT_USER_AGENT,
    'Content-Type': 'application/json',
    ...gotHeaders
  }

  const bodies = await Promise.all(to.map(toLang =>
    got.post(API_EDGE_TRANSLATE, {
      searchParams: new URLSearchParams({
        // empty from => auto-detect
        from: from || '',
        to: toLang,
        isEnterpriseClient: 'false'
      }),
      json: payload,
      headers,
      responseType: 'json',
      ...gotOptions
    }).then(res => res.body)
  ))

  /** @type {TranslationResult[]} */
  let result
  if (bodies.length === 1) {
    result = bodies[0]
  } else {
    // Merge multi-target results into previous MET shape.
    result = bodies[0].map((item, i) => ({
      ...item,
      translations: bodies.flatMap(body => body[i].translations)
    }))
  }

  if (masks) {
    for (let i = 0; i < result.length; i++) {
      const parts = masks[i].parts
      for (const tr of result[i].translations) {
        tr.text = unmaskNoTranslate(tr.text, parts)
      }
    }
  }

  return result
}

/**
 * @param {string[]} text
 * @param {string | undefined} from
 * @param {string[]} to
 * @param {TranslateOptions} options
 * @returns {Promise<TranslationResult[]>}
 */
async function translateViaAzure(text, from, to, options) {
  const gotOptions = Object.assign({}, options.gotOptions)
  const gotHeaders = gotOptions.headers || {}
  delete gotOptions.headers

  const { body } = await got.post(API_AZURE_TRANSLATE, {
    searchParams: new URLSearchParams([
      ...to.map(toLang => ['to', toLang]),
      ...Object.entries({
        'api-version': '3.0',
        from,
        // See https://learn.microsoft.com/azure/ai-services/translator/reference/v3-0-translate#optional-parameters
        ...(options.translateOptions || {})
      }).filter(([_, val]) => val != null && val !== '')
    ]),
    json: text.map(txt => ({ Text: txt })),
    headers: {
      'User-Agent': options.userAgent || DEFAULT_USER_AGENT,
      ...(options.authenticationHeaders || {}),
      ...gotHeaders
    },
    responseType: 'json',
    ...gotOptions
  })
  return body
}

/**
 * To translate
 *
 * @param {string | string[]} text content to be translated
 * @param {string} [from] source language code
 * @param {string | string[]} to target language code(s). `en` by default.
 * @param {TranslateOptions} [options] optional translate options
 *
 * @returns {Promise<TranslationResult[] | undefined>}
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

  const fromSupported = !from || lang.isSupported(from)
  const toSupported = to.every(lang.isSupported)

  if (!fromSupported || !toSupported) {
    throw new Error(`Unsupported language(s): ${!fromSupported
      ? `'${from}'`
      : !toSupported ? to.map(t => `'${t}'`).join(', ') : ''
    }`)
  }

  Array.isArray(text) || (text = [text])
  options ||= {}

  try {
    // Paid Azure path keeps Cognitive API + caller-supplied auth.
    // Free path uses Edge translatetext (no token).
    if (options.authenticationHeaders) {
      return await translateViaAzure(text, from, to, options)
    }
    return await translateViaEdge(text, from, to, options)
  } catch (e) {
    let errMsg
    if (e instanceof got.RequestError) {
      const response = e.response
      const responseBody = JSON.stringify(response && response.body, null, 2)
      errMsg = ` with a status code: ${response && response.statusCode} (${response && response.statusMessage})\n${responseBody}\n`
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
