/**
 * @import {Got, CancelableRequest, Response} from 'got
 *
 * @import {MET} from '../../index'
 */

/** @type {Got} */
const got = require('got')

const lang = require('./lang')
const { userAgent: DEFAULT_USER_AGENT } = require('../config.json')

// Free Edge endpoint: no auth
const API_EDGE_TRANSLATE = 'https://edge.microsoft.com/translate/translatetext'
// Paid Azure Translator (only when `authenticationHeaders` is provided)
const API_AZURE_TRANSLATE = 'https://api.cognitive.microsofttranslator.com/translate'

// Free Edge endpoint does not support `class="notranslate"` currently, mask them locally via regexp
// Elements with `class` containing `"notranslate"` must stay untouched in HTML mode.
const NOTRANSLATE_RE = /<([a-zA-Z][\w:-]*)((?:\s[^>]*)?\sclass\s*=\s*(["'])(?:(?!\3).)*\bnotranslate\b(?:(?!\3).)*\3[^>]*)>([\s\S]*?)<\/\1\s*>/gi
const NOTRANSLATE_PLACEHOLDER_RE = /\[\[NT(\d+)\]\]/g

/**
 * @param {string} html
 * @returns {{ masked: string, parts: string[] }}
 */
function maskNoTranslate(html) {
  /** @type {string[]} */
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
  return html.replace(NOTRANSLATE_PLACEHOLDER_RE, (_, i) => parts[Number(i)])
}

/**
 * @param {string[]} text
 * @param {string | null | undefined} from
 * @param {string[]} to
 * @param {MET.MetTranslateOptions} options
 * @returns {Promise<MET.MetTranslationResult[]>}
 */
async function translateViaEdge(text, from, to, options) {
  const gotOptions = Object.assign({}, options.gotOptions)
  const gotHeaders = gotOptions.headers || {}
  delete gotOptions.headers

  const isHtml = options.translateOptions && options.translateOptions.textType === 'html'
  const masks = isHtml ? text.map(maskNoTranslate) : null
  const payload = masks ? masks.map(m => m.masked) : text

  /** @type {CancelableRequest<Response<MET.MetTranslationResult[]>>} */
  const { body: results } = await got.post(API_EDGE_TRANSLATE, {
    searchParams: new URLSearchParams([
      ...to.map(toLang => ['to', toLang]),
      ...Object.entries({
        from,
        isEnterpriseClient: 'false'
      }).filter(([_, val]) => val != null && val !== '')
    ]),
    json: payload,
    responseType: 'json',
    headers: {
      'User-Agent': options.userAgent || DEFAULT_USER_AGENT,
      ...gotHeaders
    },
    ...gotOptions
  })

  if (masks) {
    for (let i = 0, len = results.length; i < len; i++) {
      const parts = masks[i].parts
      for (const tr of results[i].translations) {
        tr.text = unmaskNoTranslate(tr.text, parts)
      }
    }
  }

  return results
}

/**
 * @param {string[]} text
 * @param {string | null | undefined} from
 * @param {string[]} to
 * @param {MET.MetTranslateOptions} options
 * @returns {Promise<MET.MetTranslationResult[]>}
 */
async function translateViaAzure(text, from, to, options) {
  const gotOptions = Object.assign({}, options.gotOptions)
  const gotHeaders = gotOptions.headers || {}
  delete gotOptions.headers

  /** @type {CancelableRequest<Response<MET.MetTranslationResult[]>>} */
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
    responseType: 'json',
    headers: {
      'User-Agent': options.userAgent || DEFAULT_USER_AGENT,
      // See https://learn.microsoft.com/azure/ai-services/translator/reference/v3-0-reference#authentication
      ...(options.authenticationHeaders || {}),
      ...gotHeaders
    },
    ...gotOptions
  })
  return body
}

/**
 * To translate
 *
 * @param {string | string[]} text content to be translated
 * @param {string | null | undefined} from source language code
 * @param {string | string[]} to target language code(s). `en` by default.
 * @param {MET.MetTranslateOptions} [options] optional translate options
 *
 * @returns {Promise<MET.MetTranslationResult[] | undefined>}
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
    // Paid Azure path uses Cognitive API + caller-supplied auth
    const { authenticationHeaders } = options
    for (const authHeaderName in authenticationHeaders) {
      if (Object.prototype.hasOwnProperty.call(authenticationHeaders, authHeaderName)) {
        return await translateViaAzure(text, from, to, options)
      }
    }
    // Free path uses Edge API (no token)
    return await translateViaEdge(text, from, to, options)
  } catch (e) {
    let errMsg
    if (e instanceof got.RequestError) {
      const response = e.response
      if (response) {
        const responseBody = JSON.stringify(response.body, null, 2)
        errMsg = ` with a status code: ${response.statusCode} (${response.statusMessage})\n${responseBody}\n`
      } else {
        errMsg = `: no response`
      }
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
