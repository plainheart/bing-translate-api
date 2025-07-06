# bing-translate-api
[![NPM version](https://img.shields.io/npm/v/bing-translate-api.svg?style=flat)](https://www.npmjs.org/package/bing-translate-api)
[![Auto Test](https://github.com/plainheart/bing-translate-api/actions/workflows/autotest.yml/badge.svg)](https://github.com/plainheart/bing-translate-api/actions/workflows/autotest.yml)
[![NPM Downloads](https://img.shields.io/npm/dm/bing-translate-api.svg)](https://npmcharts.com/compare/bing-translate-api?minimal=true)
[![License](https://img.shields.io/npm/l/bing-translate-api.svg)](https://github.com/plainheart/bing-translate-api/blob/master/LICENSE)

A **simple** and **free** API for [Bing Translator](https://bing.com/translator) and [Microsoft Translator](https://learn.microsoft.com/azure/ai-services/translator/) for Node.js.

## Install

```
npm install bing-translate-api
```

## Usage

### Microsoft Translator <sup>🆕</sup>

Added since v4.0.0. More stable and powerful. Both free service and paid service are supported. Feel free to give it a try!

Read the [README](./src/met/README.md) for more details.

### Bing Translator

From auto-detected language to English:

```js
const { translate } = require('bing-translate-api');

translate('你好', null, 'en').then(res => {
  console.log(res.translation);
}).catch(err => {
  console.error(err);
});
```

Translation result

```js
{
  // original text
  "text": "你好",
  // user-specified language code
  "userLang": "auto-detect",
  // translated text
  "translation": "Hello",
  // `correctedText` is returned only when `correct` is set as `true`
  // supported since v1.1.0
  "correctedText": "",
  // detected language
  "language": {
    // language code of translated text
    "to": "en",
    // detected language code of original text
    "from": "zh-Hans",
    // score of language detection
    // supported since v1.1.0
    // (NOTICE: This field may not be provided at present)
    "score": 1
  },
  // feminine translation text (Only be returned when the translation result is gender-debiased)
  // supported since v4.1.0
  "feminineTranslation": undefined,
  // masculine translation text (Only be returned when the translation result is gender-debiased)
  // supported since v4.1.0
  "masculineTranslation": undefined
}
```

## API

### translate(text, [from], [to], [correct], [raw], [userAgent], [proxyAgents])

#### _text_
Type: `string`

The text to be translated, can't be blank. The **maximum** text length is **1000**.

**NOTE:**
1) The maximum text length is up to **5000** characters only in **China**.
2) In EPT mode (since `v3.0.0`), the maximum text length is currently **3000**.

##### _from_
Type: `string` Default: `auto-detect`

The language code of source text.

**MUST** be `auto-detect` or one of the codes/names (not case sensitive) contained in [lang.json](src/lang.json)

**NOTE:** The EPT mode (since `v3.0.0`) only supports the languages contained in [src/config.json#eptLangs](src/config.json#L31). Any other language will fall back to the legacy mode, in which a 429 (Too Many Requests) error often occurs.

##### _to_
Type: `string` Default: `en`

The language in which the text should be translated.

**MUST** be one of the codes/names (not case sensitive) contained in [lang.json](src/lang.json).

**NOTE:** The EPT mode (since `v3.0.0`) only supports the languages contained in [src/config.json#eptLangs](src/config.json#L31). Any other language will fall back to the legacy mode, in which a 429 (Too Many Requests) error often occurs.

##### _correct_
Type: `boolean` Default: `false` Since: `v1.1.0`

Whether to correct the input text.

Note that:
1) There is currently a **limit** of **50 characters** for correction service.
2) **Only** [the languages in the list](src/config.json#L9-L30) are supported to be corrected.

##### _raw_
Type: `boolean` Default: `false`

Whether the translation result contains raw response from Bing API.

##### _userAgent_
Type: `string`

The header value of `user-agent` used in API requests. 

Refer to [src/config.json#userAgent](src/config.json#L111) for the default user agent.

##### _proxyAgents_
Type: [`Got['Agents']`](https://github.com/sindresorhus/got/blob/v11.8.6/source/core/index.ts#L60-L64) Default: `undefined` Since: `v2.4.0`

Set [agents](https://github.com/sindresorhus/got/blob/main/documentation/tips.md#proxying) of [`got`](https://github.com/sindresorhus/got) for proxy.

## License

MIT &copy; 2021-2025 [plainheart](https://github.com/plainheart).

## Thanks

Great thanks to [Bing Translator](https://bing.com/translator) for providing such an excellent translation service.
