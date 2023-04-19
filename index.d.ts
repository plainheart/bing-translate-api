// AUTO-GENERATED. SEE scripts/index.tpl.d.ts FOR ORIGINAL TYPINGS

import type { Agents } from 'got';

export interface TranslationResult {
  /**
   * The original text
   */
  text: string;
  /**
   * The user-specified language code
   */
  userLang: string;
  /**
   * The translated text
   */
  translation: string;
  /**
   * The corrected text. This is returned only when the `correct` option is set as `true`
   */
  correctedText?: string;
  /**
   * The detected language
   */
  language: {
    /**
     * The detected language code of original text
     */
    from: string;
    /**
     * The language code of translated text
     */
    to: string;
    /**
     * The score of language detection
     */
    score: number;
  };
  /**
   * The original response from Bing translator
   */
  // TODO fine-grained typings
  raw?: object[]
}

/**
 * @param text content to be translated
 * @param from source language code. `auto-detect` by default.
 * @param to target language code. `en` by default.
 * @param correct whether to correct the input text. `false` by default.
 * @param raw the result contains raw response if `true`
 * @param userAgent the expected user agent header
 * @param proxyAgents set agents of `got` for proxy
 */
export declare function translate(
  text: string,
  from: string | null | undefined,
  to: string,
  correct?: boolean,
  raw?: boolean,
  userAgent?: string,
  proxyAgents?: Agents
): Promise<TranslationResult>;

export declare namespace lang {
  const LANGS: {
    'auto-detect': 'Auto-detect',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'as': 'Assamese',
    'az': 'Azerbaijani',
    'bn': 'Bangla',
    'ba': 'Bashkir',
    'eu': 'Basque',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'yue': 'Cantonese (Traditional)',
    'ca': 'Catalan',
    'lzh': 'Chinese (Literary)',
    'zh-Hans': 'Chinese Simplified',
    'zh-Hant': 'Chinese Traditional',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'prs': 'Dari',
    'dv': 'Divehi',
    'nl': 'Dutch',
    'en': 'English',
    'et': 'Estonian',
    'fo': 'Faroese',
    'fj': 'Fijian',
    'fil': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fr-CA': 'French (Canada)',
    'gl': 'Galician',
    'lug': 'Ganda',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'he': 'Hebrew',
    'hi': 'Hindi',
    'mww': 'Hmong Daw',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ikt': 'Inuinnaqtun',
    'iu': 'Inuktitut',
    'iu-Latn': 'Inuktitut (Latin)',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'rw': 'Kinyarwanda',
    'tlh-Latn': 'Klingon (Latin)',
    'gom': 'Konkani',
    'ko': 'Korean',
    'ku': 'Kurdish (Central)',
    'kmr': 'Kurdish (Northern)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'lv': 'Latvian',
    'ln': 'Lingala',
    'lt': 'Lithuanian',
    'dsb': 'Lower Sorbian',
    'mk': 'Macedonian',
    'mai': 'Maithili',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mr': 'Marathi',
    'mn-Cyrl': 'Mongolian (Cyrillic)',
    'mn-Mong': 'Mongolian (Traditional)',
    'my': 'Myanmar (Burmese)',
    'mi': 'Māori',
    'ne': 'Nepali',
    'nb': 'Norwegian',
    'nya': 'Nyanja',
    'or': 'Odia',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese (Brazil)',
    'pt-PT': 'Portuguese (Portugal)',
    'pa': 'Punjabi',
    'otq': 'Querétaro Otomi',
    'ro': 'Romanian',
    'run': 'Rundi',
    'ru': 'Russian',
    'sm': 'Samoan',
    'sr-Cyrl': 'Serbian (Cyrillic)',
    'sr-Latn': 'Serbian (Latin)',
    'st': 'Sesotho',
    'nso': 'Sesotho sa Leboa',
    'tn': 'Setswana',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'ty': 'Tahitian',
    'ta': 'Tamil',
    'tt': 'Tatar',
    'te': 'Telugu',
    'th': 'Thai',
    'bo': 'Tibetan',
    'ti': 'Tigrinya',
    'to': 'Tongan',
    'tr': 'Turkish',
    'tk': 'Turkmen',
    'uk': 'Ukrainian',
    'hsb': 'Upper Sorbian',
    'ur': 'Urdu',
    'ug': 'Uyghur',
    'uz': 'Uzbek (Latin)',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yo': 'Yoruba',
    'yua': 'Yucatec Maya',
    'zu': 'Zulu'
  };
  function getLangCode(lang: string): string | undefined;
  function isSupported(lang: string): boolean;
  function isCorrectable(lang: string): boolean;
}
