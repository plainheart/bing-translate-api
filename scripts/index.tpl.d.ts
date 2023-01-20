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
  const LANGS: __LANG_MAP__;
  function getLangCode(lang: string): string | undefined;
  function isSupported(lang: string): boolean;
  function isCorrectable(lang: string): boolean;
}
