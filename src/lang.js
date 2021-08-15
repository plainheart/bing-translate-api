
/**
 * Generated from https://bing.com/translator
 */
const LANGS = {
  'auto-detect': 'Auto-detect',
  af: 'Afrikaans',
  am: 'Amharic',
  ar: 'Arabic',
  as: 'Assamese',
  az: 'Azerbaijani',
  bg: 'Bulgarian',
  bn: 'Bangla',
  bs: 'Bosnian',
  ca: 'Catalan',
  cs: 'Czech',
  cy: 'Welsh',
  da: 'Danish',
  de: 'German',
  el: 'Greek',
  en: 'English',
  es: 'Spanish',
  et: 'Estonian',
  fa: 'Persian',
  fi: 'Finnish',
  fil: 'Filipino',
  fj: 'Fijian',
  fr: 'French',
  'fr-CA': 'French (Canada)',
  ga: 'Irish',
  gu: 'Gujarati',
  he: 'Hebrew',
  hi: 'Hindi',
  hr: 'Croatian',
  ht: 'Haitian Creole',
  hu: 'Hungarian',
  hy: 'Armenian',
  id: 'Indonesian',
  is: 'Icelandic',
  it: 'Italian',
  iu: 'Inuktitut',
  ja: 'Japanese',
  kk: 'Kazakh',
  km: 'Khmer',
  kmr: 'Kurdish (Northern)',
  kn: 'Kannada',
  ko: 'Korean',
  ku: 'Kurdish (Central)',
  lo: 'Lao',
  lt: 'Lithuanian',
  lv: 'Latvian',
  mg: 'Malagasy',
  mi: 'Maori',
  ml: 'Malayalam',
  mr: 'Marathi',
  ms: 'Malay',
  mt: 'Maltese',
  mww: 'Hmong Daw',
  my: 'Myanmar',
  nb: 'Norwegian',
  ne: 'Nepali',
  nl: 'Dutch',
  or: 'Odia',
  otq: 'Querétaro Otomi',
  pa: 'Punjabi',
  pl: 'Polish',
  prs: 'Dari',
  ps: 'Pashto',
  pt: 'Portuguese (Brazil)',
  'pt-PT': 'Portuguese (Portugal)',
  ro: 'Romanian',
  ru: 'Russian',
  sk: 'Slovak',
  sl: 'Slovenian',
  sm: 'Samoan',
  sq: 'Albanian',
  'sr-Cyrl': 'Serbian (Cyrillic)',
  'sr-Latn': 'Serbian (Latin)',
  sv: 'Swedish',
  sw: 'Swahili',
  ta: 'Tamil',
  te: 'Telugu',
  th: 'Thai',
  ti: 'Tigrinya',
  'tlh-Latn': 'Klingon (Latin)',
  'tlh-Piqd': 'Klingon (pIqaD)',
  to: 'Tongan',
  tr: 'Turkish',
  ty: 'Tahitian',
  uk: 'Ukrainian',
  ur: 'Urdu',
  vi: 'Vietnamese',
  yua: 'Yucatec Maya',
  yue: 'Cantonese (Traditional)',
  'zh-Hans': 'Chinese Simplified',
  'zh-Hant': 'Chinese Traditional'
}

const LANGS_CAN_CORRECT = [
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

function isSupported(lang) {
  return !!getLangCode(lang)
}

function canCorrect(lang) {
  const langCode = getLangCode(lang)
  return langCode && LANGS_CAN_CORRECT.indexOf(langCode) > -1
}

module.exports = {
  LANGS,
  getLangCode,
  isSupported,
  canCorrect
}
