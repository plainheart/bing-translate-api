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
): Promise<TranslationResult | undefined>;

export declare namespace lang {
  const LANGS: __LANG_MAP__;
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
    const LANGS: __LANG_MAP__;
    function getLangCode(lang: string): string | undefined;
    function isSupported(lang: string): boolean;
  }
}
