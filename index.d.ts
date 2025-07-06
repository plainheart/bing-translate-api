// AUTO-GENERATED. SEE scripts/index.tpl.d.ts FOR ORIGINAL TYPINGS

import type {
  Agents,
  Options as GotOptions
} from 'got';

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
   * The translated text.
   * Since `v4.1.0`, when the translation result is gender-debiased, `masculineTranslation` will be used by default.
   * For feminine, use `feminineTranslation`.
   */
  translation: string;
  /**
   * The corrected text. This is returned only when the `correct` option is set as `true`.
   * @since v1.1.0
   */
  correctedText?: string;
  /**
   * The detected language
   */
  language: {
    /**
     * The detected language code of original text
     */
    from?: string;
    /**
     * The language code of translated text
     */
    to: string;
    /**
     * The score of language detection.
     * (Notice: This field may not be provided at present)
     * @since v1.1.0
     */
    score?: number;
  };
  /**
   * The feminine translation text.
   * This is returned only when the translation result is gender-debiased.
   * @since v4.1.0
   */
  feminineTranslation?: string;
  /**
   * The masculine translation text.
   * This is returned only when the translation result is gender-debiased.
   * @since v4.1.0
   */
  masculineTranslation?: string;
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
): Promise<TranslationResult | undefined>;

export declare namespace lang {
  const LANGS: {
    'auto-detect': 'Auto-detect',
    'ace': 'Acehnese (Latin)',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'arz': 'Arabic (Egyptian)',
    'ary': 'Arabic (Moroccan)',
    'arb': 'Arabic (Romanized)',
    'hy': 'Armenian',
    'as': 'Assamese',
    'ast': 'Asturian',
    'az': 'Azerbaijani',
    'ban': 'Balinese',
    'bn': 'Bangla',
    'ba': 'Bashkir',
    'eu': 'Basque',
    'bbc': 'Batak Toba',
    'be': 'Belarusian',
    'bho': 'Bhojpuri',
    'bik': 'Bikol',
    'brx': 'Bodo',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'yue': 'Cantonese (Traditional)',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'hne': 'Chhattisgarhi',
    'lzh': 'Chinese (Literary)',
    'zh-Hans': 'Chinese Simplified',
    'zh-Hant': 'Chinese Traditional',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'prs': 'Dari',
    'dv': 'Divehi',
    'doi': 'Dogri',
    'nl': 'Dutch',
    'en': 'English',
    'en-GB': 'English (United Kingdom)',
    'epo': 'Esperanto',
    'et': 'Estonian',
    'fo': 'Faroese',
    'fj': 'Fijian',
    'fil': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fr-CA': 'French (Canada)',
    'fy': 'Frisian',
    'fur': 'Friulian',
    'gl': 'Galician',
    'lug': 'Ganda',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'he': 'Hebrew',
    'hil': 'Hiligaynon',
    'hi': 'Hindi',
    'mww': 'Hmong Daw',
    'hu': 'Hungarian',
    'iba': 'Iban',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'ilo': 'Ilocano',
    'id': 'Indonesian',
    'ikt': 'Inuinnaqtun',
    'iu': 'Inuktitut',
    'iu-Latn': 'Inuktitut (Latin)',
    'ga': 'Irish',
    'it': 'Italian',
    'jam': 'Jamaican Patois',
    'ja': 'Japanese',
    'jav': 'Javanese',
    'kea': 'Kabuverdianu',
    'kn': 'Kannada',
    'pam': 'Kapampangan',
    'ks': 'Kashmiri',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'rw': 'Kinyarwanda',
    'tlh-Latn': 'Klingon (Latin)',
    'gom': 'Konkani',
    'ko': 'Korean',
    'kri': 'Krio',
    'ku': 'Kurdish (Central)',
    'kmr': 'Kurdish (Northern)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lij': 'Ligurian (Genoese)',
    'lim': 'Limburgish',
    'ln': 'Lingala',
    'lt': 'Lithuanian',
    'lmo': 'Lombard',
    'dsb': 'Lower Sorbian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mai': 'Maithili',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mr': 'Marathi',
    'mwr': 'Marwari',
    'mfe': 'Mauritian Creole',
    'min': 'Minangkabau (Latin)',
    'mn-Cyrl': 'Mongolian (Cyrillic)',
    'mn-Mong': 'Mongolian (Traditional)',
    'my': 'Myanmar (Burmese)',
    'mi': 'Māori',
    'ne': 'Nepali',
    'nb': 'Norwegian',
    'nno': 'Norwegian Nynorsk',
    'nya': 'Nyanja',
    'oc': 'Occitan',
    'or': 'Odia',
    'pap': 'Papiamento',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese (Brazil)',
    'pt-PT': 'Portuguese (Portugal)',
    'pa': 'Punjabi',
    'pnb': 'Punjabi (Shahmukhi)',
    'otq': 'Querétaro Otomi',
    'ro': 'Romanian',
    'run': 'Rundi',
    'ru': 'Russian',
    'sm': 'Samoan',
    'sa': 'Sanskrit',
    'srd': 'Sardinian',
    'sr-Cyrl': 'Serbian (Cyrillic)',
    'sr-Latn': 'Serbian (Latin)',
    'st': 'Sesotho',
    'nso': 'Sesotho sa Leboa',
    'tn': 'Setswana',
    'crs': 'Seychelles French Creole',
    'sn': 'Shona',
    'scn': 'Sicilian',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'ty': 'Tahitian',
    'tgk': 'Tajik',
    'ta': 'Tamil',
    'tt': 'Tatar',
    'te': 'Telugu',
    'tet': 'Tetum',
    'th': 'Thai',
    'bo': 'Tibetan',
    'ti': 'Tigrinya',
    'tpi': 'Tok Pisin',
    'to': 'Tongan',
    'tr': 'Turkish',
    'tk': 'Turkmen',
    'uk': 'Ukrainian',
    'hsb': 'Upper Sorbian',
    'ur': 'Urdu',
    'ug': 'Uyghur',
    'uz': 'Uzbek (Latin)',
    'vec': 'Venetian',
    'vi': 'Vietnamese',
    'war': 'Waray',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'ydd': 'Yiddish (Eastern)',
    'yo': 'Yoruba',
    'yua': 'Yucatec Maya',
    'zu': 'Zulu'
  };
  function getLangCode(lang: string): string | undefined;
  function isSupported(lang: string): boolean;
  function isCorrectable(lang: string): boolean;
}

export declare namespace MET {
  interface MetTranslateOptions {
    translateOptions?: Record<string, object>;
    authenticationHeaders?: Record<string, string>;
    userAgent?: string;
    gotOptions?: GotOptions
  }

  /**
   * See https://learn.microsoft.com/azure/ai-services/translator/reference/v3-0-translate#response-body for full result structure
   */
  interface MetTranslationResult {
    translations: {
      text: string;
      to: string;
      sentLen?: {
        srcSentLen: number[];
        transSentLen: number[];
      };
      transliteration?: {
        script: string;
        text: string;
      };
      alignment?: object;
    }[];
    detectedLanguage?: {
      language: string;
      score: number;
    }
  }

  /**
   * @param text content to be translated
   * @param from source language code
   * @param to target language code(s). `en` by default.
   * @param options optional translate options
   */
  function translate(
    text: string | string[],
    from: string | null | undefined,
    to: string | string[],
    options?: MetTranslateOptions
  ): Promise<MetTranslationResult[] | undefined>;

  namespace lang {
    const LANGS: {
      'af': 'Afrikaans',
      'am': 'Amharic',
      'ar': 'Arabic',
      'as': 'Assamese',
      'az': 'Azerbaijani',
      'ba': 'Bashkir',
      'be': 'Belarusian',
      'bg': 'Bulgarian',
      'bho': 'Bhojpuri',
      'bn': 'Bangla',
      'bo': 'Tibetan',
      'brx': 'Bodo',
      'bs': 'Bosnian',
      'ca': 'Catalan',
      'cs': 'Czech',
      'cy': 'Welsh',
      'da': 'Danish',
      'de': 'German',
      'doi': 'Dogri',
      'dsb': 'Lower Sorbian',
      'dv': 'Divehi',
      'el': 'Greek',
      'en': 'English',
      'es': 'Spanish',
      'et': 'Estonian',
      'eu': 'Basque',
      'fa': 'Persian',
      'fi': 'Finnish',
      'fil': 'Filipino',
      'fj': 'Fijian',
      'fo': 'Faroese',
      'fr': 'French',
      'fr-CA': 'French (Canada)',
      'ga': 'Irish',
      'gl': 'Galician',
      'gom': 'Konkani',
      'gu': 'Gujarati',
      'ha': 'Hausa',
      'he': 'Hebrew',
      'hi': 'Hindi',
      'hne': 'Chhattisgarhi',
      'hr': 'Croatian',
      'hsb': 'Upper Sorbian',
      'ht': 'Haitian Creole',
      'hu': 'Hungarian',
      'hy': 'Armenian',
      'id': 'Indonesian',
      'ig': 'Igbo',
      'ikt': 'Inuinnaqtun',
      'is': 'Icelandic',
      'it': 'Italian',
      'iu': 'Inuktitut',
      'iu-Latn': 'Inuktitut (Latin)',
      'ja': 'Japanese',
      'ka': 'Georgian',
      'kk': 'Kazakh',
      'km': 'Khmer',
      'kmr': 'Kurdish (Northern)',
      'kn': 'Kannada',
      'ko': 'Korean',
      'ks': 'Kashmiri',
      'ku': 'Kurdish (Central)',
      'ky': 'Kyrgyz',
      'lb': 'Luxembourgish',
      'ln': 'Lingala',
      'lo': 'Lao',
      'lt': 'Lithuanian',
      'lug': 'Ganda',
      'lv': 'Latvian',
      'lzh': 'Chinese (Literary)',
      'mai': 'Maithili',
      'mg': 'Malagasy',
      'mi': 'Māori',
      'mk': 'Macedonian',
      'ml': 'Malayalam',
      'mn-Cyrl': 'Mongolian (Cyrillic)',
      'mn-Mong': 'Mongolian (Traditional)',
      'mni': 'Manipuri',
      'mr': 'Marathi',
      'ms': 'Malay',
      'mt': 'Maltese',
      'mww': 'Hmong Daw',
      'my': 'Myanmar (Burmese)',
      'nb': 'Norwegian',
      'ne': 'Nepali',
      'nl': 'Dutch',
      'nso': 'Sesotho sa Leboa',
      'nya': 'Nyanja',
      'or': 'Odia',
      'otq': 'Querétaro Otomi',
      'pa': 'Punjabi',
      'pl': 'Polish',
      'prs': 'Dari',
      'ps': 'Pashto',
      'pt': 'Portuguese (Brazil)',
      'pt-PT': 'Portuguese (Portugal)',
      'ro': 'Romanian',
      'ru': 'Russian',
      'run': 'Rundi',
      'rw': 'Kinyarwanda',
      'sd': 'Sindhi',
      'si': 'Sinhala',
      'sk': 'Slovak',
      'sl': 'Slovenian',
      'sm': 'Samoan',
      'sn': 'Shona',
      'so': 'Somali',
      'sq': 'Albanian',
      'sr-Cyrl': 'Serbian (Cyrillic)',
      'sr-Latn': 'Serbian (Latin)',
      'st': 'Sesotho',
      'sv': 'Swedish',
      'sw': 'Swahili',
      'ta': 'Tamil',
      'te': 'Telugu',
      'th': 'Thai',
      'ti': 'Tigrinya',
      'tk': 'Turkmen',
      'tlh-Latn': 'Klingon (Latin)',
      'tlh-Piqd': 'Klingon (pIqaD)',
      'tn': 'Setswana',
      'to': 'Tongan',
      'tr': 'Turkish',
      'tt': 'Tatar',
      'ty': 'Tahitian',
      'ug': 'Uyghur',
      'uk': 'Ukrainian',
      'ur': 'Urdu',
      'uz': 'Uzbek (Latin)',
      'vi': 'Vietnamese',
      'xh': 'Xhosa',
      'yo': 'Yoruba',
      'yua': 'Yucatec Maya',
      'yue': 'Cantonese (Traditional)',
      'zh-Hans': 'Chinese Simplified',
      'zh-Hant': 'Chinese Traditional',
      'zu': 'Zulu'
    };
    function getLangCode(lang: string): string | undefined;
    function isSupported(lang: string): boolean;
  }
}
