## Microsoft Translator

A more stable and powerful translator than the Bing website translator. Supported since v4.0.0.

### Basic Usage

#### From Auto-Detected Language to Another Language

```js
const { MET } = require('bing-translate-api')

MET.translate('你好，很高兴认识你！', null, 'en').then(res => {
  console.log(res);
}).catch(err => {
  console.error(err);
});
```

<details>
<summary>Translation result</summary>

```json
[
  {
    "detectedLanguage": {
      "language": "zh-Hans",
      "score": 1
    },
    "translations": [
      {
        "text": "Hello, nice to meet you!",
        "to": "en"
      }
    ]
  }
]
```
</details>

#### From Auto-Detected Language to Multiple Languages

```js
const { MET } = require('bing-translate-api')

MET.translate('你好，很高兴认识你！', null, ['en', 'ja']).then(res => {
  console.log(res);
}).catch(err => {
  console.error(err);
});
```

<details>
<summary>Translation result</summary>

```json
[
  {
    "detectedLanguage": {
      "language": "zh-Hans",
      "score": 1
    },
    "translations": [
      {
        "text": "Hello, nice to meet you!",
        "to": "en"
      },
      {
        "text": "こんにちは、はじめまして!",
        "to": "ja"
      }
    ]
  }
]
```
</details>

#### Translate HTML text

```js
const { MET } = require('bing-translate-api')

const htmlText = `
  <div class="notranslate">This will not be translated.</div>
  <div>This will be translated.</div>
`;
MET.translate(htmlText, null, 'zh-Hans', {
  translateOptions: {
    // Explicitly set textType as `html`. Defaults to `plain`.
    textType: 'html'
  }
}).then(res => {
  console.log(res);
}).catch(err => {
  console.error(err);
});
```

<details>
<summary>Translation result</summary>

```json
[
  {
    "detectedLanguage": {
      "language": "en",
      "score": 1
    },
    "translations": [
      {
        "text": "<div class=\"notranslate\">This will not be translated.</div>\n<div>这将被翻译。</div>",
        "to": "zh-Hans"
      }
    ]
  }
]
```
</details>

### Optional Translation Options

https://learn.microsoft.com/azure/ai-services/translator/reference/v3-0-translate#optional-parameters

### Full Translation Results

https://learn.microsoft.com/azure/ai-services/translator/reference/v3-0-translate#response-body

### Supported Languages

Refer to [lang.json](./lang.json).

### Service Limits

https://learn.microsoft.com/azure/ai-services/translator/service-limits#character-and-array-limits-per-request

Note that the correction service is not available.

### Use Paid Service With Your Private Keys

```js
const { MET } = require('bing-translate-api')

MET.translate('你好，很高兴认识你！', null, 'en', {
  authenticationHeaders: {
    // Use private subscription key
    'Ocp-Apim-Subscription-Key': 'YOUR KEY',
    // Or use a JWT token
    'Authorization': 'YOUR TOKEN'
  }
}).then(res => {
  console.log(res);
}).catch(err => {
  console.error(err);
});
```

See also https://learn.microsoft.com/azure/ai-services/translator/reference/v3-0-reference#authentication

> Note that using your private keys, the translator will skip to fetch the free authorization and you will have to check if the authorization is expired by yourself.
